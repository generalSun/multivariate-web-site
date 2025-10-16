import { defineStore } from 'pinia'
import { getUserMenu } from '@/libs/axios/modules/user'
import { computed, ref } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
  const menuInfo = ref(null)
  menuInfo.value = null
  const hasMenuInfo = computed(() => !!menuInfo.value)
  const fetchMenuInfo = async () => {
    if (hasMenuInfo.value) {
      return menuInfo.value
    }
    try {
      const response = await getUserMenu()
      const { data } = response ?? {}
      const menuInfo = data ?? []
      menuInfo.value = menuInfo
      return menuInfo
    } catch (error) {
      console.error('获取菜单信息失败:', error)
      return Promise.reject(error)
    }
  }
  return { fetchMenuInfo, hasMenuInfo, menuInfo }
})
