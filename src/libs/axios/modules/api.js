import axios from '@/libs/axios'
import { userBaseUrl } from './../domain'
import { isEnv } from '@/utils/index.js'
import storage from '@/utils/storage/index.js'
import { PROJECT_STATUS, STORAGE_KEYS } from '@/configs/enums.js'
import { v4 as uuidV4 } from 'uuid'
export const getModules = async (params) => {
  if (isEnv('development')) {
    const data = await storage.getItem(STORAGE_KEYS.USER_MODULES).then((value = '') => JSON.parse(value))
    const { parent_id } = params ?? {}
    return Promise.resolve({ data: data?.filter((item) => item.parent_id === parent_id) })
  }
  return axios.get(`${userBaseUrl}/api-docs/modules`, { params })
}
export const createModules = async (params) => {
  if (isEnv('development')) {
    const data = await storage.getItem(STORAGE_KEYS.USER_MODULES).then((value = '') => JSON.parse(value))
    const index = data.findIndex((item) => item.id === params.id)
    let result = {}
    if (index >= 0) {
      const temp = data[index]
      result = {
        id: uuidV4(),
        status: PROJECT_STATUS.enabled.value,
        updated_at: Date.now(),
        created_at: Date.now(),
        ...temp,
        ...params,
      }
      data.splice(index, 1, result)
    } else {
      result = {
        id: uuidV4(),
        status: PROJECT_STATUS.enabled.value,
        updated_at: Date.now(),
        created_at: Date.now(),
        ...params,
      }
      data.unshift(result)
    }
    await storage.setItem(STORAGE_KEYS.USER_MODULES, JSON.stringify(data))
    return Promise.resolve({ data: result })
  }
  return axios.post(`${userBaseUrl}/api-docs/modules`, params)
}
export const deleteModules = async (id) => {
  if (isEnv('development')) {
    const data = await storage.getItem(STORAGE_KEYS.USER_MODULES).then((value = '') => JSON.parse(value))
    const index = data.findIndex((item) => item.id === id)
    if (index >= 0) {
      data.splice(index, 1)
    }
    await storage.setItem(STORAGE_KEYS.USER_MODULES, JSON.stringify(data))
    return Promise.resolve({ data: [] })
  }
  return axios.delete(`${userBaseUrl}/api-docs/modules/${id}`)
}
export const updateModules = (id, params) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: params })
  }
  return axios.put(`${userBaseUrl}/api-docs/modules/${id}`, params)
}
