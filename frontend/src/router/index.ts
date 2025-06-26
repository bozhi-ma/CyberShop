/**
 * 路由配置文件
 * 定义应用所有页面路由及其懒加载
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/products', name: 'ProductList', component: () => import('@/views/ProductList.vue') },
  { path: '/product/:id', name: 'ProductDetail', component: () => import('@/views/ProductDetail.vue') },
  { path: '/user', name: 'UserCenter', component: () => import('@/views/UserCenter.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
  { path: '/analysis', name: 'Analysis', component: () => import('@/views/Analysis.vue') },
  { path: '/compare', name: 'Compare', component: () => import('@/views/Compare.vue') },
  { path: '/ar', name: 'AR', component: () => import('@/views/AR.vue') },
  { path: '/favorites', name: 'Favorites', component: () => import('@/views/Favorites.vue') },
  { path: '/orders', name: 'OrderList', component: () => import('@/views/OrderList.vue') },
  { path: '/cart', name: 'Cart', component: () => import('@/views/Cart.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 