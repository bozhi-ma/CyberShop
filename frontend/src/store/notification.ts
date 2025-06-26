/*
 * 消息通知全局状态管理（Pinia）
 * 管理通知列表、添加、移除、清空等
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表ref
  const notifications = ref<any[]>([])

  /**
   * 添加通知
   * @param notification 通知对象
   */
  function addNotification(notification: any) {
    notifications.value.push({
      id: Date.now(),
      message: notification.message,
      type: notification.type,
      time: new Date().toLocaleString()
    })
  }

  /**
   * 移除通知
   * @param id 通知ID
   */
  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  /**
   * 清空通知
   */
  function clearNotifications() {
    notifications.value = []
  }

  return { notifications, addNotification, removeNotification, clearNotifications }
}) 