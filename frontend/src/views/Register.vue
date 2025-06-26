<template>
  <div class="register-container">
    <div class="register-panel">
      <h1 class="register-title">创建您的账户</h1>
      <p class="register-subtitle">加入 CyberShop，开启未来购物体验</p>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        class="register-form"
        @submit.prevent="submitForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="设置您的用户名" 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入您的邮箱地址" 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="设置密码" 
            show-password 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            show-password 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm" 
            class="register-button"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="extra-links">
        <el-link type="info" @click="goToLogin" :disabled="loading">已有账户？立即登录</el-link>
        <el-link type="info" @click="goToHome" :disabled="loading">返回首页</el-link>
      </div>
    </div>
    
    <!-- 注册失败弹窗 -->
    <RegisterErrorDialog
      v-model:visible="showErrorDialog"
      :error="registerError"
      @retry="handleRetry"
      @close="handleErrorClose"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { useNotificationStore } from '../store/notification';
import RegisterErrorDialog from '../components/RegisterErrorDialog.vue';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const showErrorDialog = ref(false);
const registerError = ref<any>(null);

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致!"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
});

const submitForm = async () => {
  if (!registerFormRef.value) return;
  
  try {
    const valid = await registerFormRef.value.validate();
    if (valid) {
      loading.value = true;
      showErrorDialog.value = false; // 隐藏之前的错误弹窗
      
      // 调用注册接口
      await userStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      });
      
      // 注册成功后会通过userStore自动处理登录和跳转
      notificationStore.addNotification({
        message: '注册成功！正在为您自动登录...',
        type: 'success'
      });
      
    } else {
      notificationStore.addNotification({
        message: '请检查表单填写是否正确',
        type: 'warning'
      });
    }
  } catch (error: any) {
    console.error('注册失败:', error);
    
    // 保存错误信息并显示详细错误弹窗
    registerError.value = error;
    showErrorDialog.value = true;
    
    // 同时显示简单的错误通知
    let errorMessage = '注册失败，请稍后重试';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    notificationStore.addNotification({
      message: errorMessage,
      type: 'error'
    });
    
  } finally {
    loading.value = false;
  }
};

// 处理重试
const handleRetry = () => {
  showErrorDialog.value = false;
  submitForm();
};

// 处理错误弹窗关闭
const handleErrorClose = () => {
  showErrorDialog.value = false;
  registerError.value = null;
};

function goToLogin() {
  if (!loading.value) {
    router.push('/login');
  }
}

function goToHome() {
  if (!loading.value) {
    router.push('/');
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  box-sizing: border-box;
}

.register-panel {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  text-align: center;
}

.register-title {
  color: #e0e0e0;
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.register-subtitle {
  color: #c0c4cc;
  margin-bottom: 32px;
  font-size: 1rem;
}

.register-form {
  width: 100%;
}

:deep(.el-form-item__label) {
  color: #c0c4cc;
}

.register-button {
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