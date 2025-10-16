import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { readonly } from 'vue'
export const GLOBAL_COMPONENTS_SIZE = readonly({
  large: 'large',
  small: 'small',
  default: 'default',
})

export const DARK_MODE = readonly({
  dark: 'dark',
  light: 'light',
})

export const LANGUAGE = readonly({
  'zh-cn': {
    language: 'zh-cn',
    locale: zhCn,
    label: '中文',
    icon: { [DARK_MODE.dark]: 'zhcn', [DARK_MODE.light]: 'zhongwen' },
  },
  en: {
    language: 'en',
    locale: en,
    label: 'English',
    icon: { [DARK_MODE.dark]: 'en', [DARK_MODE.light]: 'yingwen' },
  },
})

export const USER_STATUS_INFO = readonly({
  online: {
    id: 'online',
    label: '在线',
    color: 'green',
    icon: 'online',
  },
  offline: {
    id: 'offline',
    label: '离线',
    color: 'gray',
    icon: 'offline',
  },
  away: {
    id: 'away',
    label: '离开',
    color: 'darkgray',
    icon: 'away',
  },
  busy: {
    id: 'busy',
    label: '忙碌',
    color: 'red',
    icon: 'busy',
  },
  doNotDisturb: {
    id: 'doNotDisturb',
    label: '请勿打扰',
    color: 'red',
    icon: 'doNotDisturb',
  },
})

export const EMOJIS = readonly([
  {
    id: 'online',
    label: '在线',
    color: 'green',
    icon: 'online',
  },
  {
    id: 'offline',
    label: '离线',
    color: 'gray',
    icon: 'offline',
  },
  {
    id: 'busy',
    label: '离开',
    color: 'darkgray',
    icon: 'away',
  },
  {
    id: 'busy',
    label: '忙碌',
    color: 'red',
    icon: 'busy',
  },
  {
    id: 'doNotDisturb',
    label: '请勿打扰',
    color: 'red',
    icon: 'doNotDisturb',
  },
])

export const EVENT_BUS_NAMES = readonly({
  UNAUTHORIZED: 'UNAUTHORIZED',
  SHOW_API_DETAIL: 'SHOW_API_DETAIL',
  COPY_SUCCESS: 'COPY_SUCCESS',
  COPY_ERROR: 'COPY_ERROR',
  PASTE_ERROR: 'PASTE_ERROR',
  LINE_SUCCESS: 'LINE_SUCCESS',
})

export const STORAGE_KEYS = readonly({
  USER_TOKEN: 'USER_TOKEN',
  USER_MODULES: 'USER_MODULES',
})

export const SORT_DESCRIPTION = readonly({
  ascending: { label: '升序', value: 'ascending' },
  descending: { label: '降序', value: 'descending' },
})

export const GENDER_OPTIONS = readonly({
  male: {
    label: '男',
    value: 'male',
  },
  female: {
    label: '女',
    value: 'female',
  },
})

export const PROJECT_STATUS = {
  enabled: {
    label: '启用',
    value: 'enabled',
  },
  disabled: {
    label: '禁用',
    value: 'disabled',
  },
}

export const OPERATE_STATUS = readonly({
  create: { label: '创建', value: 'create' },
  update: { label: '更新', value: 'update' },
  delete: { label: '删除', value: 'delete' },
  edit: { label: '编辑', value: 'edit' },
  view: { label: '查看', value: 'view' },
  add: { label: '添加', value: 'add' },
})
