import { ref } from 'vue'
import ui from '@/libs/ui'
const { sunLoading } = ui
export const useLoading = function () {
  const loading = ref(null)

  const startLoading = (options = {}) => {
    loading.value = sunLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.3)',
      ...options,
    })
  }

  const stopLoading = () => {
    if (loading.value) {
      loading.value.close()
      loading.value = null
    }
  }

  return {
    startLoading,
    stopLoading,
  }
}
