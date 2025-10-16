import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhCn from './locales/zhCn.json'
import { defaultLanguage } from '@/configs/config'
const messages = {
  en,
  'zh-cn': zhCn,
}

const i18n = createI18n({
  locale: defaultLanguage, // 设置默认语言
  fallbackLocale: defaultLanguage, // 设置回退语言
  messages,
})

export default i18n
