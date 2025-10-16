import axios from '@/libs/axios'
import { isEnv } from '@/utils/index.js'

// 获取新闻列表
export const getNewsList = () => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get('/api/news/list')
}

// 获取新闻详情
export const getNewsDetail = (id) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get(`/api/news/detail/${id}`)
}

// 获取热门新闻
export const getHotNews = () => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get('/api/news/hot')
}

// 搜索新闻
export const searchNews = (keyword) => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get('/api/news/search', { params: { keyword } })
}

// 获取新闻分类
export const getNewsCategories = () => {
  if (isEnv('development')) {
    return Promise.resolve({ data: [] })
  }
  return axios.get('/api/news/categories')
}
