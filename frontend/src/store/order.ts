/**
 * 订单全局状态管理（Pinia）
 * 管理订单列表、下单、订单详情等
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getOrderList, getOrderDetail, cancelOrder, reorder } from '../api/order'

export const useOrderStore = defineStore('order', () => {
  // 订单列表ref
  const orders = ref<any[]>([])
  const total = ref(0)
  const loading = ref(false)
  // 当前订单详情ref
  const orderDetail = ref<any>(null)

  async function fetchOrders(params: any = {}) {
    loading.value = true
    const res = await getOrderList(params)
    orders.value = res.list
    total.value = res.total
    loading.value = false
  }

  async function fetchOrderDetail(id: number) {
    loading.value = true
    const res = await getOrderDetail(id)
    orderDetail.value = res
    loading.value = false
  }

  async function doCancelOrder(id: number) {
    return await cancelOrder(id)
  }

  async function doReorder(id: number) {
    return await reorder(id)
  }

  function placeOrder(cartItems: any[], userId: number) {
    // 简单模拟下单，实际应调用后端API
    const newOrder = {
      id: Date.now(),
      userId,
      items: JSON.parse(JSON.stringify(cartItems)),
      status: '已下单',
      createdAt: new Date().toLocaleString()
    }
    orders.value.push(newOrder)
    return newOrder
  }

  function getOrdersByUser(userId: number) {
    return orders.value.filter(order => order.userId === userId)
  }

  /**
   * 添加订单
   * @param order 订单对象
   */
  function addOrder(order: any) {
    orders.value.push(order)
  }

  /**
   * 设置订单详情
   * @param detail 订单详情对象
   */
  function setOrderDetail(detail: any) {
    orderDetail.value = detail
  }

  return { orders, total, loading, orderDetail, placeOrder, getOrdersByUser, addOrder, setOrderDetail, fetchOrders, fetchOrderDetail, doCancelOrder, doReorder }
}) 