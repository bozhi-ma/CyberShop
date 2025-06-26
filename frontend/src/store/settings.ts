/*
 * 用户设置全局状态管理（Pinia）
 * 管理主题、语言、通知、自动播放等设置
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 主题设置ref
  const theme = ref('light')
  // 语言设置ref
  const language = ref('zh-CN')
  // 通知开关ref
  const notificationsEnabled = ref(true)
  // 自动播放开关ref
  const autoPlay = ref(false)

  /**
   * 设置主题
   * @param val 主题值
   */
  function setTheme(val: string) {
    theme.value = val
    // 应用主题到body
    document.body.className = val
  }

  /**
   * 设置语言
   * @param val 语言值
   */
  function setLanguage(val: string) {
    language.value = val
  }

  /**
   * 切换通知开关
   */
  function toggleNotifications() {
    notificationsEnabled.value = !notificationsEnabled.value
  }

  /**
   * 切换自动播放开关
   */
  function toggleAutoPlay() {
    autoPlay.value = !autoPlay.value
  }

  return { 
    theme, 
    language, 
    notificationsEnabled, 
    autoPlay,
    setTheme, 
    setLanguage, 
    toggleNotifications, 
    toggleAutoPlay 
  }
}) 