import { onScopeDispose, render, ref, defineComponent, h, getCurrentInstance } from 'vue'
import { dialogContainer } from '@/components/dialogContainer'
import { isType } from '@/utils'
import ui from '@/libs/ui'
const { sunConfigProvider } = ui
export const useDialog = (globalOptions = {}) => {
  const dialogOptions = ref({})
  dialogOptions.value = {}
  const dialogVisible = ref(false)
  const dialogInstance = ref(null)
  const container = ref(null)
  const currentInstance = getCurrentInstance()
  const dialogComponent = defineComponent({
    components: {
      dialogContainer,
      configProvider: sunConfigProvider,
    },
    render() {
      return (
        <configProvider
          v-slots={{
            default: () => {
              return (
                <dialogContainer
                  ref={dialogInstance}
                  vModel={dialogVisible.value}
                  {...dialogOptions.value}
                ></dialogContainer>
              )
            },
          }}
        ></configProvider>
      )
    },
  })
  const updateDialogOptions = (options = {}) => {
    Object.assign(dialogOptions.value, options)
  }
  const resetDialogOptions = () => {
    dialogOptions.value = {}
  }
  // 关闭对话框
  const closeDialog = () => {
    if (dialogInstance.value) {
      render(null, container.value)
      container.value?.parentNode?.removeChild(container.value)
      dialogInstance.value = null
      container.value = null
    }
  }
  // 隐藏对话框
  const hiddenDialog = () => {
    dialogVisible.value = false
  }
  // 显示对话框
  const showDialog = (options = {}) => {
    resetDialogOptions()
    let resolve
    let reject
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
    dialogVisible.value = true
    updateDialogOptions({
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
    if (!dialogInstance.value) {
      const vNode = h(dialogComponent)
      vNode.appContext = currentInstance.appContext // 继承上下文
      container.value = document.createElement('div')
      render(vNode, container.value)
      document.body.appendChild(container.value.firstElementChild)
    }
    return promise
  }
  // 自动清理
  onScopeDispose(() => {
    closeDialog()
  })
  updateDialogOptions(globalOptions)
  return {
    showDialog,
    closeDialog,
    hiddenDialog,
    updateDialogOptions,
    resetDialogOptions,
  }
}
