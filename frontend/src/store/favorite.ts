/*
 * 收藏夹全局状态管理（Pinia）
 * 管理收藏商品列表、添加、移除、清空等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  // 收藏商品列表ref
  const favoriteList = ref<any[]>([])

  // 从 localStorage 初始化状态
  const savedFavorites = localStorage.getItem('favoriteList')
  if (savedFavorites) {
    favoriteList.value = JSON.parse(savedFavorites)
  }

  // 计算属性，用于判断商品是否在收藏夹中
  const isFavorite = computed(() => {
    return (productId: number) => favoriteList.value.some(item => item.id === productId)
  })
  
  // 更新 localStorage 的辅助函数
  function updateLocalStorage() {
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList.value))
  }

  /**
   * 切换商品的收藏状态
   * @param product 商品对象
   * @returns a boolean indicating if the product is now in favorites.
   */
  function toggleFavorite(product: any): boolean {
    const index = favoriteList.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      favoriteList.value.splice(index, 1) // 移除
      updateLocalStorage()
      return false
    } else {
      favoriteList.value.push(product) // 添加
      updateLocalStorage()
      return true
    }
  }

  /**
   * 清空收藏夹
   */
  function clearFavorite() {
    favoriteList.value = []
    localStorage.removeItem('favoriteList')
  }

  return { favoriteList, isFavorite, toggleFavorite, clearFavorite }
}) 