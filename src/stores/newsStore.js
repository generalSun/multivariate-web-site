import { defineStore } from 'pinia'
import { getNewsList, getNewsDetail, getHotNews, searchNews, getNewsCategories } from '@/libs/axios/modules/news'

export const useNewsStore = defineStore('newsStore', {
  state: () => ({
    newsList: [],
    currentNews: null,
    hotNews: [],
    categories: [],
    searchResults: [],
    error: null,
  }),
  getters: {
    hasError: (state) => state.error !== null,
  },
  actions: {
    async fetchNewsList() {
      try {
        const response = await getNewsList()
        this.newsList = response.data
        this.error = null
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        this.error = '获取新闻列表失败'
      }
    },

    async fetchNewsDetail(id) {
      try {
        const response = await getNewsDetail(id)
        this.currentNews = response.data
        this.error = null
      } catch (error) {
        console.error('获取新闻详情失败:', error)
        this.error = '获取新闻详情失败'
      }
    },

    async fetchHotNews() {
      try {
        const response = await getHotNews()
        this.hotNews = response.data
        this.error = null
      } catch (error) {
        console.error('获取热门新闻失败:', error)
        this.error = '获取热门新闻失败'
      }
    },

    async searchNews(keyword) {
      try {
        const response = await searchNews(keyword)
        this.searchResults = response.data
        this.error = null
      } catch (error) {
        console.error('搜索新闻失败:', error)
        this.error = '搜索新闻失败'
      }
    },

    async fetchNewsCategories() {
      try {
        const response = await getNewsCategories()
        this.categories = response.data
        this.error = null
      } catch (error) {
        console.error('获取新闻分类失败:', error)
        this.error = '获取新闻分类失败'
      }
    },
  },
})
