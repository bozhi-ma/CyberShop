<template>
  <div v-if="error" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <el-icon size="64" color="#f56c6c">
          <Warning />
        </el-icon>
      </div>
      <h2 class="error-title">抱歉，出现了一些问题</h2>
      <p class="error-message">{{ error.message || '发生了未知错误' }}</p>
      <div class="error-actions">
        <el-button type="primary" @click="handleRetry">
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
        <el-button @click="handleGoHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="handleReport">
          <el-icon><Message /></el-icon>
          报告问题
        </el-button>
      </div>
      <div v-if="showDetails" class="error-details">
        <details>
          <summary>错误详情</summary>
          <pre>{{ error.stack }}</pre>
        </details>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Warning, Refresh, House, Message } from '@element-plus/icons-vue'

interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
}

const router = useRouter()
const error = ref<ErrorInfo | null>(null)
const showDetails = ref(false)

// 捕获子组件错误
onErrorCaptured((err: Error, _instance, info) => {
  console.error('Error captured by ErrorBoundary:', err, info)
  
  error.value = {
    message: err.message,
    stack: err.stack,
    componentStack: info
  }
  
  // 发送错误到监控服务
  reportError(err, info)
  
  return false // 阻止错误继续传播
})

// 重试功能
const handleRetry = () => {
  error.value = null
  window.location.reload()
}

// 返回首页
const handleGoHome = () => {
  error.value = null
  router.push('/')
}

// 报告问题
const handleReport = () => {
  showDetails.value = !showDetails.value
  ElMessage.info('错误详情已显示，请复制信息联系技术支持')
}

// 发送错误到监控服务
const reportError = (err: Error, info: string) => {
  // 这里可以集成 Sentry 或其他错误监控服务
  const errorData = {
    message: err.message,
    stack: err.stack,
    componentStack: info,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }
  
  console.error('Error report:', errorData)
  
  // 发送到后端错误收集接口
  fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(errorData)
  }).catch(console.error)
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-icon {
  margin-bottom: 20px;
}

.error-title {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.error-message {
  color: #606266;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.error-details {
  margin-top: 24px;
  text-align: left;
}

.error-details details {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.error-details pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .error-container {
    padding: 24px;
    margin: 16px;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-actions .el-button {
    width: 100%;
  }
}
</style> 