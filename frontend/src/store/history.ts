/*
 * 浏览历史全局状态管理（Pinia）
 * 管理浏览历史列表、添加、移除、清空等
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  // 浏览历史列表ref
  const historyList = ref<any[]>([])

  /**
   * 添加浏览历史
   * @param item 浏览商品对象
   */
  function addToHistory(product: any) {
    // 移除已存在的相同商品
    historyList.value = historyList.value.filter(item => item.id !== product.id)
    // 添加到开头
    historyList.value.unshift({
      ...product,
      viewTime: new Date().toLocaleString()
    })
    // 限制历史记录数量
    if (historyList.value.length > 20) {
      historyList.value = historyList.value.slice(0, 20)
    }
  }

  /**
   * 移除浏览历史
   * @param id 历史ID
   */
  function removeFromHistory(productId: number) {
    historyList.value = historyList.value.filter(item => item.id !== productId)
  }

  /**
   * 清空浏览历史
   */
  function clearHistory() {
    historyList.value = []
  }

  return { historyList, addToHistory, removeFromHistory, clearHistory }
}) 