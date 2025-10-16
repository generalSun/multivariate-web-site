import { GLOBAL_COMPONENTS_SIZE } from '@/configs/enums'
export const buttonConfig = {
  autoInsertSpace: true,
}

export const messageConfig = {
  duration: 3000,
  max: 3,
  showClose: true,
  grouping: true,
  offset: 100,
}

export const experimentalFeatures = {}

export const emptyValues = ['', null, undefined, NaN, 0]

export const valueOnClear = null

export const defaultLanguage = 'zh-cn'

export const defaultSize = GLOBAL_COMPONENTS_SIZE.default

export const defaultZIndex = 3000

export const storageDarkModeKey = 'vitepress-theme-appearance'

export const whiteList = ['/login', '/accessDenied', '/notFound']

export const systemTitle = 'Vue3 Admin'

export const defaultHeight = '60px'
