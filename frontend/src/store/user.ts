/*
 * 用户信息全局状态管理（Pinia）
 * 管理用户登录状态、信息、登出等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register as apiRegister, login as apiLogin, updateProfile as apiUpdateProfile } from '../api/user'
import { useNotificationStore } from './notification'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const router = useRouter();
  const notificationStore = useNotificationStore();

  const userInfo = ref<any>(null);
  const token = ref(localStorage.getItem('token') || null);

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value);

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }
  
  async function register(data: any) {
    try {
      await apiRegister(data);
      
      // 注册成功
      notificationStore.addNotification({ 
        message: '注册成功，正在为您自动登录...', 
        type: 'success' 
      });
      
      // 自动登录
      await login({ username: data.username, password: data.password });
      
    } catch (error: any) {
      console.error('注册失败:', error);
      
      // 处理不同类型的错误
      let errorMessage = '注册失败，请稍后重试';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '网络连接失败，请检查网络设置';
      } else if (error.code === 'TIMEOUT') {
        errorMessage = '请求超时，请稍后重试';
      }
      
      // 显示错误通知
      notificationStore.addNotification({ 
        message: errorMessage, 
        type: 'error' 
      });
      
      // 重新抛出错误，让调用方知道注册失败
      throw error;
    }
  }

  async function login(data: any) {
    try {
      const res = await apiLogin(data);
      if (res.data && res.data.token) {
        setToken(res.data.token);
        userInfo.value = res.data.user;
        notificationStore.addNotification({ message: '登录成功！', type: 'success' });
        router.push('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || '登录失败';
      notificationStore.addNotification({ message, type: 'error' });
      console.error('登录失败:', error);
    }
  }

  function logout() {
    setToken(null);
    userInfo.value = null;
    notificationStore.addNotification({ message: '您已成功退出登录', type: 'info' });
    router.push('/login');
  }

  async function updateProfile(data: any) {
    try {
      const res = await apiUpdateProfile(data);
      if (res.data && res.data.user) {
        userInfo.value = res.data.user;
        ElMessage.success('资料更新成功！');
      }
    } catch (error: any) {
      ElMessage.error('资料更新失败');
    }
  }

  return { userInfo, token, isLoggedIn, login, register, logout, updateProfile };
}, {
  persist: {
    paths: ['userInfo', 'token'],
  },
}) 