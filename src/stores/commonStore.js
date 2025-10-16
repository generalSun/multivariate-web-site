import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('commonStore', () => {
  const languageInfo = ref({})
  const darkModeInfo = ref({})
  const setLanguageInfo = (info) => {
    languageInfo.value = info ?? { switchLanguage: () => {}, language: {}, locale: {} }
  }
  const setDarkModeInfo = (info) => {
    darkModeInfo.value = info ?? { isDark: false, toggleDark: () => {}, modeLabel: '' }
  }
  return {
    languageInfo,
    darkModeInfo,
    setLanguageInfo,
    setDarkModeInfo,
  }
})
