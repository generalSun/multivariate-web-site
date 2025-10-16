import axios from '@/libs/axios'
import { userBaseUrl } from './../domain'
import { isEnv } from '@/utils/index.js'

export const login = (params) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.post(`${userBaseUrl}/login`, params)
}

export const register = (params) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.post(`${userBaseUrl}/register`, params)
}

export const logout = (params = {}) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.post(`${userBaseUrl}/logout`, params)
}

export const getUserInfo = () => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`${userBaseUrl}/user_info`)
}

export const getUserMenu = () => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`${userBaseUrl}/menu`)
}

export const getUserFriends = (userId) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`${userBaseUrl}/friends/${userId}`)
}

export const setUserStatus = (params = {}) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.put(`${userBaseUrl}/users/status`, params)
}

export const getUserStatus = (params = {}) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`${userBaseUrl}/users/valid-statuses`, { params })
}

export const getUserRoles = (id) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`${userBaseUrl}/users/${id}/roles`)
}
