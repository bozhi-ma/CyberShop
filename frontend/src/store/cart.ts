/**
 * 购物车全局状态管理（Pinia）
 * 管理购物车商品、增删改查等
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 商品类型定义
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  brand: string
  category: string
  rating?: number
  reviews?: number
  sales?: number
  isNew?: boolean
  isHot?: boolean
  description?: string
}

// 购物车商品类型
export interface CartItem extends Product {
  count: number
  selected?: boolean
  addedAt: Date
}

// 购物车状态类型
export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

// 本地存储键名
const CART_STORAGE_KEY = 'cybershop_cart'
const CART_VERSION = '1.0'

export const useCartStore = defineStore('cart', () => {
  // 状态
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // 计算属性
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.count, 0)
  )

  const totalOriginalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.count, 0)
  )

  const totalDiscount = computed(() => totalOriginalPrice.value - totalPrice.value)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.count, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => item.selected)
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
  )

  const selectedTotalItems = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.count, 0)
  )

  // 本地存储操作
  const saveToStorage = () => {
    try {
      const cartData = {
        version: CART_VERSION,
        items: items.value,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    } catch (err) {
      console.error('保存购物车到本地存储失败:', err)
      error.value = '保存购物车失败'
    }
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const cartData = JSON.parse(stored)
        
        // 版本检查
        if (cartData.version === CART_VERSION) {
          items.value = cartData.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
          lastUpdated.value = new Date(cartData.lastUpdated)
        } else {
          // 版本不匹配，清空购物车
          console.warn('购物车版本不匹配，清空购物车')
          clearCart()
        }
      }
    } catch (err) {
      console.error('从本地存储加载购物车失败:', err)
      error.value = '加载购物车失败'
    }
  }

  // 监听购物车变化，自动保存
  watch(items, saveToStorage, { deep: true })

  // 初始化时加载数据
  loadFromStorage()

  /**
   * 添加商品到购物车
   * @param product 商品对象
   * @param count 数量，默认为1
   */
  function addToCart(product: Product, count: number = 1) {
    try {
      isLoading.value = true
      error.value = null

      const existingItem = items.value.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.count += count
        existingItem.addedAt = new Date()
        ElMessage.success(`已更新商品数量: ${existingItem.name}`)
      } else {
        const newItem: CartItem = {
          ...product,
          count,
          selected: true,
          addedAt: new Date()
        }
        items.value.push(newItem)
        ElMessage.success(`已添加到购物车: ${product.name}`)
      }

      lastUpdated.value = new Date()
    } catch (err) {
      console.error('添加商品到购物车失败:', err)
      error.value = '添加商品失败'
      ElMessage.error('添加商品失败，请重试')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 从购物车移除商品
   * @param productId 商品ID
   */
  function removeFromCart(productId: number) {
    try {
      const item = items.value.find(item => item.id === productId)
      if (item) {
        items.value = items.value.filter(item => item.id !== productId)
        ElMessage.success(`已从购物车移除: ${item.name}`)
        lastUpdated.value = new Date()
      }
    } catch (err) {
      console.error('从购物车移除商品失败:', err)
      error.value = '移除商品失败'
      ElMessage.error('移除商品失败，请重试')
    }
  }

  /**
   * 更新商品数量
   * @param productId 商品ID
   * @param count 新数量
   */
  function updateItemCount(productId: number, count: number) {
    try {
      if (count <= 0) {
        removeFromCart(productId)
        return
      }

      const item = items.value.find(item => item.id === productId)
      if (item) {
        item.count = count
        lastUpdated.value = new Date()
      }
    } catch (err) {
      console.error('更新商品数量失败:', err)
      error.value = '更新数量失败'
      ElMessage.error('更新数量失败，请重试')
    }
  }

  /**
   * 切换商品选中状态
   * @param productId 商品ID
   */
  function toggleItemSelection(productId: number) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.selected = !item.selected
      lastUpdated.value = new Date()
    }
  }

  /**
   * 全选/取消全选
   * @param selected 是否全选
   */
  function selectAll(selected: boolean) {
    items.value.forEach(item => {
      item.selected = selected
    })
    lastUpdated.value = new Date()
  }

  /**
   * 清空购物车
   */
  function clearCart() {
    try {
      items.value = []
      lastUpdated.value = new Date()
      localStorage.removeItem(CART_STORAGE_KEY)
      ElMessage.success('购物车已清空')
    } catch (err) {
      console.error('清空购物车失败:', err)
      error.value = '清空购物车失败'
      ElMessage.error('清空购物车失败，请重试')
    }
  }

  /**
   * 移除选中的商品
   */
  function removeSelected() {
    try {
      const removedCount = selectedItems.value.length
      items.value = items.value.filter(item => !item.selected)
      lastUpdated.value = new Date()
      ElMessage.success(`已移除 ${removedCount} 件商品`)
    } catch (err) {
      console.error('移除选中商品失败:', err)
      error.value = '移除选中商品失败'
      ElMessage.error('移除选中商品失败，请重试')
    }
  }

  /**
   * 检查商品是否在购物车中
   * @param productId 商品ID
   */
  function isInCart(productId: number): boolean {
    return items.value.some(item => item.id === productId)
  }

  /**
   * 获取商品在购物车中的数量
   * @param productId 商品ID
   */
  function getItemCount(productId: number): number {
    const item = items.value.find(item => item.id === productId)
    return item ? item.count : 0
  }

  /**
   * 同步购物车到服务器
   */
  async function syncToServer() {
    try {
      isLoading.value = true
      error.value = null

      // 这里可以添加与服务器同步的逻辑
      // const response = await fetch('/api/cart/sync', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: items.value })
      // })

      lastUpdated.value = new Date()
      ElMessage.success('购物车已同步')
    } catch (err) {
      console.error('同步购物车失败:', err)
      error.value = '同步购物车失败'
      ElMessage.error('同步购物车失败，请重试')
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    items,
    isLoading,
    error,
    lastUpdated,
    
    // 计算属性
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    totalItems,
    selectedItems,
    selectedTotalPrice,
    selectedTotalItems,
    
    // 方法
    addToCart,
    removeFromCart,
    updateItemCount,
    toggleItemSelection,
    selectAll,
    clearCart,
    removeSelected,
    isInCart,
    getItemCount,
    syncToServer,
    saveToStorage,
    loadFromStorage
  }
}) 