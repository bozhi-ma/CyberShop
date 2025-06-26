/*
 * 搜索全局状态管理（Pinia）
 * 管理搜索历史、建议、热门等
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  // 搜索历史ref
  const searchHistory = ref<string[]>([])
  // 搜索建议ref
  const searchSuggestions = ref<string[]>([])
  // 热门搜索ref
  const hotSearches = ref<string[]>([
    '手机', '电脑', '耳机', '键盘', '鼠标', '显示器', '平板', '智能手表'
  ])

  /**
   * 添加搜索历史
   * @param keyword 关键词
   */
  function addSearchHistory(keyword: string) {
    // 移除已存在的相同关键词
    searchHistory.value = searchHistory.value.filter(item => item !== keyword)
    // 添加到开头
    searchHistory.value.unshift(keyword)
    // 限制历史记录数量
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }

  /**
   * 移除搜索历史
   * @param keyword 关键词
   */
  function removeSearchHistory(keyword: string) {
    searchHistory.value = searchHistory.value.filter(item => item !== keyword)
  }

  /**
   * 清空搜索历史
   */
  function clearSearchHistory() {
    searchHistory.value = []
  }

  /**
   * 设置搜索建议
   * @param suggestions 建议数组
   */
  function setSearchSuggestions(suggestions: string[]) {
    searchSuggestions.value = suggestions
  }

  return { 
    searchHistory, 
    searchSuggestions, 
    hotSearches,
    addSearchHistory, 
    removeSearchHistory, 
    clearSearchHistory,
    setSearchSuggestions
  }
}) 