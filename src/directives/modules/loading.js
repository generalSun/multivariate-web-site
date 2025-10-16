import { useLoading } from '@/hooks/useLoading'

const loadingDirective = {
  mounted(el, binding) {
    const { startLoading, stopLoading } = useLoading()
    const target = binding.arg ?? el
    el._loadingFunctions = {
      start: () => startLoading({ target: target }),
      stop: () => stopLoading(),
    }

    if (binding.value) {
      el._loadingFunctions.start()
    }
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? el._loadingFunctions.start() : el._loadingFunctions.stop()
    }
  },

  unmounted(el) {
    el._loadingFunctions.stop()
    delete el._loadingFunctions
  },
}

export default loadingDirective
