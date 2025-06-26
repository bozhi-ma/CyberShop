/*
 * 用户中心页面
 * 展示用户信息、订单、收藏、消息、历史、设置等
 */
<template>
  <div class="user-center-minimal">
    <div class="user-info">
      <img :src="user.avatar || '/assets/R-C.jpg'" class="avatar" />
      <div class="nickname">{{ user.nickname }}</div>
    </div>
    <div class="user-section">
      <div class="info-list">
        <div>邮箱：{{ user.email }}</div>
        <div>手机号：{{ user.phone }}</div>
      </div>
      <el-divider />
      <el-button class="uc-btn" @click="goFavorites">我的收藏</el-button>
      <el-button class="uc-btn" @click="goCart">购物车</el-button>
      <el-button class="uc-btn" type="danger" @click="logout">退出登录</el-button>
    </div>
    <el-button type="default" style="margin-top: 24px; width: 100%;" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const router = useRouter();

const user = computed(() => ({
  avatar: userStore.userInfo.avatar || '/assets/R-C.jpg',
  nickname: userStore.userInfo.nickname || userStore.userInfo.username || '未登录',
  email: userStore.userInfo.email || '未绑定',
  phone: userStore.userInfo.phone || '未绑定',
}));

function goFavorites() {
  router.push('/favorites');
}
function goCart() {
  router.push('/cart');
}
function logout() {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.user-center-minimal {
  max-width: 420px;
  margin: 60px auto 0 auto;
  background: #232334;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 36px 32px 32px 32px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
  background: #444;
}
.nickname {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 6px;
}
.info-list {
  width: 100%;
  text-align: left;
  font-size: 1rem;
  margin-bottom: 10px;
  color: #bfc4d0;
}
.uc-btn {
  width: 100%;
  margin: 8px 0 0 0;
  font-size: 1rem;
  border-radius: 8px;
  background: #292940;
  color: #fff;
  border: none;
}
.uc-btn.el-button--danger {
  background: #3a2232;
  color: #ff6b81;
}
.el-divider {
  margin: 18px 0;
  background: #36364a;
}
</style> 