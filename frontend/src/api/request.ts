/**
 * 通用请求封装
 * 用于统一处理API请求
 */

import axios from 'axios';
// Do not import useUserStore at the top level to avoid circular dependencies

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // Dynamically import the store inside the interceptor
    const { useUserStore } = await import('../store/user');
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 