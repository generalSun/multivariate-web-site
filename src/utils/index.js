import emitter from '@/utils/eventBus'
import { EVENT_BUS_NAMES } from '@/configs/enums.js'

export const importFiles = ({ modules, callback }) => {
  const components = {}
  for (const [path, module = {}] of Object.entries(modules)) {
    Object.entries(module).forEach(([key, value]) => {
      if (key === 'default') {
        const result = path.match(/([^/]+)\.[a-zA-Z0-9]+$/) ?? []
        if (result[1]) {
          components[result[1]] = value
        }
      } else {
        components[key] = value
      }
      callback?.(value)
    })
  }
  return components
}

export const isType = (value, type) => {
  if (Array.isArray(type)) {
    return type.some((item) => isType(value, item))
  }
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

export const copy = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else {
      // 兼容旧浏览器
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    emitter.emit(EVENT_BUS_NAMES.COPY_SUCCESS, { status: 'success', message: '复制成功' })
  } catch (err) {
    emitter.emit(EVENT_BUS_NAMES.COPY_SUCCESS, { status: 'fail', message: `复制失败，请手动复制:${err}` })
  }
}

export const paste = async (event) => {
  try {
    let text
    if (navigator.clipboard) {
      text = await navigator.clipboard.readText()
    } else {
      const clipboardData = event.clipboardData || window.clipboardData
      text = clipboardData.getData('text')
    }
    return text
  } catch (error) {
    emitter.emit(EVENT_BUS_NAMES.PASTE_ERROR, { status: 'fail', message: `粘贴失败:${error}` })
  }
}

export const isEnv = (env) => {
  return import.meta.env.VITE_APP_ENV !== env
}
