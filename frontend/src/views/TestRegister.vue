<template>
  <div class="test-register-container">
    <div class="test-panel">
      <h1>注册失败弹窗测试</h1>
      
      <div class="test-buttons">
        <el-button @click="testNetworkError" type="danger">测试网络错误</el-button>
        <el-button @click="testUserExists" type="warning">测试用户已存在</el-button>
        <el-button @click="testServerError" type="info">测试服务器错误</el-button>
        <el-button @click="testTimeout" type="primary">测试超时错误</el-button>
        <el-button @click="testValidationError" type="success">测试验证错误</el-button>
      </div>
      
      <div class="test-info">
        <p>点击上面的按钮测试不同类型的注册失败弹窗</p>
      </div>
    </div>
    
    <!-- 注册失败弹窗 -->
    <RegisterErrorDialog
      v-model:visible="showErrorDialog"
      :error="testError"
      @retry="handleRetry"
      @close="handleErrorClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RegisterErrorDialog from '../components/RegisterErrorDialog.vue';

const showErrorDialog = ref(false);
const testError = ref<any>(null);

// 测试网络错误
const testNetworkError = () => {
  testError.value = {
    code: 'NETWORK_ERROR',
    message: '网络连接失败'
  };
  showErrorDialog.value = true;
};

// 测试用户已存在
const testUserExists = () => {
  testError.value = {
    response: {
      status: 409,
      data: {
        message: '用户名已存在'
      }
    }
  };
  showErrorDialog.value = true;
};

// 测试服务器错误
const testServerError = () => {
  testError.value = {
    response: {
      status: 500,
      data: {
        message: '服务器内部错误'
      }
    }
  };
  showErrorDialog.value = true;
};

// 测试超时错误
const testTimeout = () => {
  testError.value = {
    code: 'TIMEOUT',
    message: '请求超时'
  };
  showErrorDialog.value = true;
};

// 测试验证错误
const testValidationError = () => {
  testError.value = {
    response: {
      status: 400,
      data: {
        message: '输入信息有误'
      }
    }
  };
  showErrorDialog.value = true;
};

// 处理重试
const handleRetry = () => {
  console.log('重试注册');
  showErrorDialog.value = false;
};

// 处理错误弹窗关闭
const handleErrorClose = () => {
  showErrorDialog.value = false;
  testError.value = null;
};
</script>

<style scoped>
.test-register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
}

.test-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.test-panel h1 {
  color: #e0e0e0;
  margin-bottom: 30px;
  font-size: 2rem;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.test-buttons .el-button {
  width: 100%;
  padding: 15px;
  font-size: 16px;
}

.test-info {
  color: #c0c4cc;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .test-panel {
    padding: 20px;
  }
  
  .test-panel h1 {
    font-size: 1.5rem;
  }
}
</style> 