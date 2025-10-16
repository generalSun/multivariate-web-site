import { computed, toValue, onScopeDispose } from 'vue'
import { useFullscreen as usePcFullscreen } from '@/utils/vueUse'
export const useFullScreen = function (instance, isPcFullScreen) {
  const target = computed(() => {
    const result = toValue(instance)
    return result?.$el ?? result
  })
  if (isPcFullScreen) {
    return usePcFullscreen(target)
  }
  const toggle = () => {
    target.value?.classList?.toggle('webFullScreen')
  }
  const isFullScreen = computed(() => {
    return target.value?.classList?.contains('webFullScreen')
  })
  const handleEsc = (event) => {
    if (event.key === 'Escape' || event.code === 'Escape' || event.keyCode === 27) {
      if (isFullScreen.value) {
        target.value?.classList?.remove('webFullScreen')
      }
    }
  }
  // 添加事件监听器
  window.addEventListener('keydown', handleEsc)
  // 自动清理
  onScopeDispose(() => {
    window.removeEventListener('keydown', handleEsc)
  })
  return { toggle, isFullScreen }
}
