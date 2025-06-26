<template>
  <el-dialog
    v-model="localVisible"
    title="注册失败"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="register-error-dialog"
  >
    <div class="error-content">
      <div class="error-icon">
        <el-icon size="48" color="#f56c6c">
          <CircleCloseFilled />
        </el-icon>
      </div>
      
      <div class="error-message">
        <h3>{{ errorTitle }}</h3>
        <p>{{ errorMessage }}</p>
      </div>
      
      <div v-if="errorDetails" class="error-details">
        <h4>可能的原因：</h4>
        <ul>
          <li v-for="(detail, index) in errorDetails" :key="index">
            {{ detail }}
          </li>
        </ul>
      </div>
      
      <div v-if="suggestions" class="error-suggestions">
        <h4>建议解决方案：</h4>
        <ul>
          <li v-for="(suggestion, index) in suggestions" :key="index">
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleRetry" type="primary" :loading="retrying">
          {{ retrying ? '重试中...' : '重新注册' }}
        </el-button>
        <el-button @click="handleClose">关闭</el-button>
        <el-button @click="handleContactSupport" type="info" plain>
          联系客服
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CircleCloseFilled } from '@element-plus/icons-vue';

interface Props {
  visible: boolean;
  error: any;
  onRetry?: () => void;
  onClose?: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'retry': [];
  'close': [];
}>();

// 用于v-model的本地变量
const localVisible = ref(props.visible);

// 监听外部visible变化，同步到本地
watch(() => props.visible, (val) => {
  localVisible.value = val;
});
// 监听本地变化，向外emit
watch(localVisible, (val) => {
  emit('update:visible', val);
});

const retrying = ref(false);

// 计算错误信息
const errorTitle = computed(() => {
  if (props.error?.response?.status === 400) {
    return '输入信息有误';
  } else if (props.error?.response?.status === 409) {
    return '用户已存在';
  } else if (props.error?.response?.status >= 500) {
    return '服务器错误';
  } else if (props.error?.code === 'NETWORK_ERROR') {
    return '网络连接失败';
  } else if (props.error?.code === 'TIMEOUT') {
    return '请求超时';
  }
  return '注册失败';
});

const errorMessage = computed(() => {
  if (props.error?.response?.data?.message) {
    return props.error.response.data.message;
  } else if (props.error?.message) {
    return props.error.message;
  }
  return '注册过程中发生了错误，请稍后重试。';
});

const errorDetails = computed(() => {
  const details = [];
  
  if (props.error?.response?.status === 400) {
    details.push('用户名或邮箱格式不正确');
    details.push('密码强度不够');
    details.push('必填字段未填写完整');
  } else if (props.error?.response?.status === 409) {
    details.push('该用户名已被其他用户使用');
    details.push('该邮箱已被注册');
  } else if (props.error?.response?.status >= 500) {
    details.push('服务器暂时不可用');
    details.push('数据库连接异常');
  } else if (props.error?.code === 'NETWORK_ERROR') {
    details.push('网络连接不稳定');
    details.push('防火墙或代理设置问题');
  } else if (props.error?.code === 'TIMEOUT') {
    details.push('网络响应时间过长');
    details.push('服务器负载过高');
  }
  
  return details;
});

const suggestions = computed(() => {
  const suggestions = [];
  
  if (props.error?.response?.status === 400) {
    suggestions.push('检查用户名长度（3-20个字符）');
    suggestions.push('确保密码至少6个字符');
    suggestions.push('使用有效的邮箱地址格式');
  } else if (props.error?.response?.status === 409) {
    suggestions.push('尝试使用不同的用户名');
    suggestions.push('使用其他邮箱地址');
    suggestions.push('如果忘记密码，可以尝试找回密码');
  } else if (props.error?.response?.status >= 500) {
    suggestions.push('稍后重试');
    suggestions.push('检查网络连接');
    suggestions.push('联系客服获取帮助');
  } else if (props.error?.code === 'NETWORK_ERROR') {
    suggestions.push('检查网络连接');
    suggestions.push('尝试切换网络环境');
    suggestions.push('关闭VPN或代理软件');
  } else if (props.error?.code === 'TIMEOUT') {
    suggestions.push('稍后重试');
    suggestions.push('检查网络速度');
    suggestions.push('尝试在非高峰时段注册');
  }
  
  return suggestions;
});

// 处理重试
const handleRetry = async () => {
  retrying.value = true;
  emit('retry');
  
  // 模拟重试延迟
  setTimeout(() => {
    retrying.value = false;
  }, 1000);
};

// 处理关闭
const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

// 联系客服
const handleContactSupport = () => {
  // 这里可以打开客服聊天窗口或跳转到客服页面
  window.open('mailto:support@cybershop.com?subject=注册问题反馈', '_blank');
};
</script>

<style scoped>
.register-error-dialog {
  --el-dialog-bg-color: rgba(26, 26, 46, 0.95);
  --el-dialog-border-color: rgba(0, 255, 247, 0.2);
}

.error-content {
  text-align: center;
  padding: 20px 0;
}

.error-icon {
  margin-bottom: 20px;
}

.error-message h3 {
  color: #f56c6c;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

.error-message p {
  color: #c0c4cc;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.error-details,
.error-suggestions {
  text-align: left;
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-details h4,
.error-suggestions h4 {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
}

.error-details ul,
.error-suggestions ul {
  color: #c0c4cc;
  font-size: 14px;
  line-height: 1.6;
  padding-left: 20px;
}

.error-details li,
.error-suggestions li {
  margin-bottom: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-error-dialog {
    width: 90% !important;
    margin: 20px auto;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .dialog-footer .el-button {
    width: 100%;
  }
}
</style> 