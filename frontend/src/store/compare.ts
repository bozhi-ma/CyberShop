/*
 * 商品对比全局状态管理（Pinia）
 * 管理对比商品列表、添加、移除、清空等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  // 对比商品列表ref
  const compareList = ref<any[]>([])

  // 从 localStorage 初始化状态
  const savedCompare = localStorage.getItem('compareList')
  if (savedCompare) {
    compareList.value = JSON.parse(savedCompare)
  }

  // 计算属性，用于判断商品是否在对比列表中
  const isInCompare = computed(() => {
    return (productId: number) => compareList.value.some(item => item.id === productId)
  })

  // 更新 localStorage 的辅助函数
  function updateLocalStorage() {
    localStorage.setItem('compareList', JSON.stringify(compareList.value))
  }

  /**
   * 切换商品的对比状态
   * @param product 商品对象
   * @returns a boolean indicating if the product is now in compare list.
   */
  function toggleCompare(product: any): boolean {
    const index = compareList.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      compareList.value.splice(index, 1) // 移除
      updateLocalStorage()
      return false
    } else {
      // 限制最多对比4个商品
      if (compareList.value.length >= 4) {
        // 在这里可以抛出错误或者使用通知中心提示用户
        console.error("最多只能对比4个商品")
        return false
      }
      compareList.value.push(product) // 添加
      updateLocalStorage()
      return true
    }
  }

  /**
   * 清空对比列表
   */
  function clearCompare() {
    compareList.value = []
    localStorage.removeItem('compareList')
  }

  return { compareList, isInCompare, toggleCompare, clearCompare }
}) 