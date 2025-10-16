import { onScopeDispose, render, ref, defineComponent, h, getCurrentInstance } from 'vue'
import { drawerContainer } from '@/components/drawerContainer'
import { isType } from '@/utils'
import ui from '@/libs/ui'
const { sunConfigProvider } = ui
export const useDrawer = (globalOptions = {}) => {
  const drawerOptions = ref({})
  drawerOptions.value = {}
  const drawerVisible = ref(false)
  const drawerInstance = ref(null)
  const container = ref(null)
  const currentInstance = getCurrentInstance()
  const drawerComponent = defineComponent({
    components: {
      drawerContainer,
      configProvider: sunConfigProvider,
    },
    render() {
      return (
        <configProvider
          v-slots={{
            default: () => {
              return (
                <drawerContainer
                  ref={drawerInstance}
                  vModel={drawerVisible.value}
                  {...drawerOptions.value}
                ></drawerContainer>
              )
            },
          }}
        ></configProvider>
      )
    },
  })
  const updateDrawerOptions = (options = {}) => {
    Object.assign(drawerOptions.value, options)
  }
  const resetDrawerOptions = () => {
    drawerOptions.value = {}
  }
  // 关闭对话框
  const closeDrawer = () => {
    if (drawerInstance.value) {
      render(null, container.value)
      container.value?.parentNode?.removeChild(container.value)
      drawerInstance.value = null
      container.value = null
    }
  }
  // 隐藏对话框
  const hiddenDrawer = () => {
    drawerVisible.value = false
  }
  // 显示对话框
  const showDrawer = (options = {}) => {
    let resolve
    let reject
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
    drawerVisible.value = true
    updateDrawerOptions({
      ...options,
      onConfirm: (paramsInfo) => {
        if (isType(options.onConfirm, 'Function')) {
          options.onConfirm(paramsInfo)
        }
        resolve(paramsInfo)
      },
      onClose: (paramsInfo) => {
        if (isType(options.onClose, 'Function')) {
          options.onClose(paramsInfo)
        }
        reject(paramsInfo)
      },
    })
    if (!drawerInstance.value) {
      const vNode = h(drawerComponent)
      vNode.appContext = currentInstance.appContext // 继承上下文
      container.value = document.createElement('div')
      render(vNode, container.value)
      document.body.appendChild(container.value.firstElementChild)
    }
    return promise
  }
  // 自动清理
  onScopeDispose(() => {
    closeDrawer()
  })
  updateDrawerOptions(globalOptions)
  return {
    showDrawer,
    closeDrawer,
    hiddenDrawer,
    updateDrawerOptions,
    resetDrawerOptions,
  }
}
