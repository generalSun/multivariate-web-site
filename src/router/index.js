import { createRouter, createWebHistory } from 'vue-router'
import { routes as normalRoutes } from './modules/normalRoutes'
import { routes as dynamicRoutes } from './modules/dynamicRoutes'
import { whiteList, systemTitle } from '@/configs/config'
import { useUserStore } from '@/stores/userStore'
import { useMenuStore } from '@/stores/menuStore'
import { isType } from '@/utils'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: normalRoutes,
})

const generateRoutesFromMenu = (menus = []) => {
  const menuList = menus.toSorted((a, b) => b.id - a.id)
  const list = {}
  menuList.forEach((menu) => {
    const id = menu.id
    const parentId = menu.parentId
    const parent = list[parentId]
    const item = list[id]
    const meta = dynamicRoutes[menu.name].meta ?? {}
    let route = {
      path: dynamicRoutes[menu.name].path,
      name: menu.name,
      meta: { ...meta, permissions: menu?.premissions, title: menu.title },
      component: dynamicRoutes[menu.name].component,
    }
    if (item) {
      route = Object.assign(item, route)
    }
    if (parentId) {
      delete list[id]
      if (!parent) {
        list[parentId] ??= {}
        list[parentId].children ??= []
        list[parentId].children.push(route)
      } else {
        parent.children ??= []
        parent.children.push(route)
      }
    }
  })
  return Object.values(list)
}

const checkPermission = (to, userInfo) => {
  const permissions = to?.meta?.permissions
  const permissionList = isType(permissions, 'String') ? [permissions] : isType(permissions, 'Array') ? permissions : []
  return !permissions || permissionList.includes(userInfo.role)
}

router.beforeEach(async (to) => {
  try {
    const meta = to?.meta ?? {}
    const title = meta?.title ?? ''
    document.title = `${systemTitle}${title ? ` - ${title}` : ''}`
    if (whiteList.includes(to.path)) {
      return // 如果在白名单中，直接跳转
    }
    const userStore = useUserStore()
    await userStore.fetchUserInfo()
    await userStore.fetchUsersRoles()
    if (to.name !== '404Page') {
      return true
    }
    const menuStore = useMenuStore()
    await menuStore.fetchMenuInfo()
    const userMenu = menuStore.menuInfo
    const dynamicRoutes = generateRoutesFromMenu(userMenu)
    dynamicRoutes.forEach((route = {}) => {
      if (!router.hasRoute(route.name)) {
        router.addRoute(route)
      }
    })
    const userInfo = userStore.userInfo
    const resolveTo = router.resolve({ path: to.path })
    if (resolveTo) {
      if (checkPermission(resolveTo, userInfo)) {
        return { name: resolveTo.name }
      }
      return { name: 'accessDenied' }
    }
    return false
  } catch {
    return false
  }
})

export default router
