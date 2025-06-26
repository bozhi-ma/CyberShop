<template>
  <div class="login-container">
    <div class="login-panel">
      <h1 class="login-title">CyberShop</h1>
      <p class="login-subtitle">欢迎回来，请登录您的账户</p>
      <el-form :model="form" class="login-form" @submit.prevent="onLogin">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" autocomplete="current-password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="extra-links">
        <el-link type="info" @click="goToRegister">还没有账户？立即注册</el-link>
        <el-link type="info" @click="goToHome">返回首页</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();
const form = reactive({ username: '', password: '' });

const onLogin = async () => {
  await userStore.login(form);
  // 登录成功后可跳转或提示
};

function goToRegister() {
  router.push('/register');
}

function goToHome() {
  router.push('/');
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  box-sizing: border-box;
}

.login-panel {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  text-align: center;
}

.login-title {
  color: #e0e0e0;
  font-size: 2.5rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.login-subtitle {
  color: #c0c4cc;
  margin-bottom: 32px;
  font-size: 1rem;
}

.login-form {
  width: 100%;
}

:deep(.el-form-item__label) {
  color: #c0c4cc;
}

.login-button {
  width: 100%;
  margin-top: 16px;
}

.extra-links {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

:deep(.el-link.el-link--info) {
  color: #909399;
}

:deep(.el-link.el-link--info:hover) {
  color: #409eff;
}
</style> 