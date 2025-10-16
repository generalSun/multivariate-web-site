import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import emitter from '@/utils/eventBus'
import ui from '@/libs/ui'
import { EVENT_BUS_NAMES } from '@/configs/enums'
import {
  getUserInfo,
  login,
  logout,
  setUserStatus,
  getUserStatus,
  register,
  getUserRoles,
} from '@/libs/axios/modules/user'
import { STORAGE_KEYS } from '@/configs/enums.js'

export const useUserStore = defineStore('userStore', () => {
  const { sunMessage } = ui
  const userInfo = ref({})
  userInfo.value = {}
  const userRoles = ref()
  const token = ref('')
  // 可以添加需要的getter
  const userId = computed(() => userInfo.value['user_id'])
  const hasUserInfo = computed(() => !!userId.value)
  const isLogin = computed(() => !!hasUserInfo.value)
  const getToken = async () => {
    if (!token.value) {
      token.value = await storage.getItem(STORAGE_KEYS.USER_TOKEN)
    }
    return token.value
  }
  const setToken = (tokenValue) => {
    return storage.setItem(STORAGE_KEYS.USER_TOKEN, tokenValue).then((data) => {
      token.value = data
      return token.value
    })
  }
  const fetchUsersRoles = async () => {
    if (userRoles.value || !isLogin.value) {
      return
    }
    try {
      const response = await getUserRoles(userId.value)
      const { data } = response ?? {}
      userRoles.value = data
    } catch (error) {
      console.error('获取用户角色失败:', error)
      userRoles.value = []
      return Promise.reject(error)
    }
  }
  const fetchLogin = async (params) => {
    if (isLogin.value) {
      return token.value
    }
    try {
      const response = await login(params)
      const { data } = response ?? {}
      return setToken(data ?? '')
    } catch (error) {
      console.error('登录失败:', error)
      return Promise.reject(error)
    }
  }
  const fetchRegister = async (params) => {
    if (isLogin.value) {
      return token.value
    }
    try {
      const response = await register(params)
      const { data } = response ?? {}
      return setToken(data ?? '')
    } catch (error) {
      console.error('登录失败:', error)
      return Promise.reject(error)
    }
  }
  const fetchLogout = async (params) => {
    if (!isLogin.value) {
      return
    }
    await logout(params)
    emitter.emit(EVENT_BUS_NAMES.UNAUTHORIZED)
  }
  const fetchUserInfo = async () => {
    if (hasUserInfo.value) {
      return userInfo.value
    }
    try {
      const response = await getUserInfo()
      const { data } = response ?? {}
      userInfo.value = {
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        gender: data.gender,
        last_login: data.last_login,
        phone_number: data.phone_number,
        unique_code: data.unique_code,
        user_id: data.user_id,
        username: data.username,
        name: data.name ?? data.username ?? 'unknown',
        status: data.status ?? 'online',
        description: data.description ?? '这个人很懒，什么都没有留下',
      }
      return userInfo.value
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return Promise.reject(error)
    }
  }
  const updateUserStatus = async (params = { status: 'online' }) => {
    try {
      const response = await setUserStatus(params)
      const { data } = response ?? {}
      userInfo.value.status = params.status
      sunMessage.success(data)
    } catch (error) {
      console.error('更新状态失败:', error)
      return Promise.reject(error)
    }
  }
  const fetchUserStatus = async () => {
    try {
      const response = await getUserStatus()
      const { data } = response ?? {}
      console.log('getUserStatus', data)
    } catch (error) {
      console.error('获取状态失败:', error)
      return Promise.reject(error)
    }
  }
  const reset = () => {
    setToken('').then(() => {
      userInfo.value = {}
    })
  }
  return {
    fetchLogin,
    fetchRegister,
    fetchLogout,
    fetchUserInfo,
    fetchUsersRoles,
    updateUserStatus,
    fetchUserStatus,
    hasUserInfo,
    token,
    getToken,
    reset,
    userId,
    userInfo,
    isLogin,
  }
})
