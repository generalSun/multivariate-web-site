import axios from 'axios'
import STATUS_CODES from './code'
import emitter from '@/utils/eventBus'
import { ElMessage } from 'element-plus' // 引入 Element Plus 的消息组件
import { useUserStore } from '@/stores/userStore.js'
import { EVENT_BUS_NAMES } from '@/configs/enums.js'
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // API 的 base_url
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    try {
      const userStore = useUserStore()
      const token = await userStore?.getToken()
      if (token) {
        // 比如添加 token
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    } catch {
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data: resData = {} } = response ?? {}
    const { code, message } = resData
    if (code !== STATUS_CODES.OK) {
      // 处理自定义错误
      ElMessage({
        message: message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      if ([STATUS_CODES.UNAUTHORIZED, STATUS_CODES.NOT_FOUND].includes(code)) {
        emitter.emit(EVENT_BUS_NAMES.UNAUTHORIZED)
      }
      return Promise.reject(new Error(message || 'Error'))
    }
    return resData
  },
  (error) => {
    const { response = {} } = error
    const { data: resData = {} } = response
    const { code, message = 'Error' } = resData
    if ([STATUS_CODES.UNAUTHORIZED, STATUS_CODES.NOT_FOUND].includes(code)) {
      emitter.emit(EVENT_BUS_NAMES.UNAUTHORIZED)
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(new Error(message))
  }
)
export default service
