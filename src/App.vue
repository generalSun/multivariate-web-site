<script setup>
import { computed, ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import routerView from '@/libs/ui/routerView.vue'
import { DARK_MODE, EVENT_BUS_NAMES, LANGUAGE } from '@/configs/enums'
import { useDark, useToggle } from '@/utils/vueUse'
import { useUserStore } from '@/stores/userStore.js'
import { useCommonStore } from '@/stores/commonStore.js'
import emitter from '@/utils/eventBus'
import ui from '@/libs/ui'
import { defaultLanguage, storageDarkModeKey } from '@/configs/config'
const { sunConfigProvider, sunMessage } = ui
const { proxy } = getCurrentInstance()
const language = ref(defaultLanguage)
const userStore = useUserStore()
const commonStore = useCommonStore()
const isDark = useDark({
  storageKey: storageDarkModeKey,
  valueDark: DARK_MODE.dark,
  valueLight: DARK_MODE.light,
  disableTransition: false,
})
const toggleDark = useToggle(isDark)
const modeLabel = computed(() => (isDark.value ? DARK_MODE.dark : DARK_MODE.light))
const locale = computed(() => LANGUAGE[language.value].locale)
const switchLanguage = (lang) => {
  const nextLanguage = () => {
    const keys = Object.keys(LANGUAGE)
    const index = keys.findIndex((key) => key === language.value)
    if (index >= 0) {
      const resultIndex = (index + 1) % keys.length
      return keys[resultIndex]
    }
    return defaultLanguage
  }
  language.value = lang ?? nextLanguage()
  proxy.$i18n.locale = language.value
}
const handleBeforeUnload = () => {
  // userStore.fetchLogout()
}
const handleUnAuthorized = () => {
  window.$router.push({ name: 'login' }).then(() => {
    userStore?.reset()
  })
}
const handleResult = ({ status, message }) => {
  if (status === 'success') {
    sunMessage.success(message)
  } else {
    sunMessage.error(message)
  }
}
onMounted(async () => {
  emitter.on(EVENT_BUS_NAMES.UNAUTHORIZED, handleUnAuthorized)
  emitter.on(EVENT_BUS_NAMES.COPY_SUCCESS, handleResult)
  emitter.on(EVENT_BUS_NAMES.COPY_ERROR, handleResult)
  emitter.on(EVENT_BUS_NAMES.PASTE_ERROR, handleResult)
  emitter.on(EVENT_BUS_NAMES.LINE_SUCCESS, handleResult)
  commonStore?.setLanguageInfo({ switchLanguage, language, locale })
  commonStore?.setDarkModeInfo({ isDark, toggleDark, modeLabel })
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  emitter.off(EVENT_BUS_NAMES.UNAUTHORIZED, handleUnAuthorized)
  emitter.off(EVENT_BUS_NAMES.COPY_SUCCESS, handleResult)
  emitter.off(EVENT_BUS_NAMES.COPY_ERROR, handleResult)
  emitter.off(EVENT_BUS_NAMES.PASTE_ERROR, handleResult)
  emitter.off(EVENT_BUS_NAMES.LINE_SUCCESS, handleResult)
})
</script>

<template>
  <sunConfigProvider>
    <routerView></routerView>
  </sunConfigProvider>
</template>

<style lang="scss" scoped></style>
