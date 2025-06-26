<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div" class="notification-list">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="notification-item"
        :class="notification.type"
        @click="notificationStore.removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <el-icon v-if="notification.type === 'success'"><CircleCheckFilled /></el-icon>
          <el-icon v-else-if="notification.type === 'error'"><CircleCloseFilled /></el-icon>
          <el-icon v-else-if="notification.type === 'warning'"><WarningFilled /></el-icon>
          <el-icon v-else><InfoFilled /></el-icon>
        </div>
        <div class="notification-content">
          <div class="notification-message">{{ notification.message }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
        <div class="notification-close" @click.stop="notificationStore.removeNotification(notification.id)">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useNotificationStore } from '../store/notification';
import { 
  CircleCheckFilled, 
  CircleCloseFilled, 
  WarningFilled, 
  InfoFilled, 
  Close 
} from '@element-plus/icons-vue';

const notificationStore = useNotificationStore();

// 自动移除通知
onMounted(() => {
  const autoRemoveInterval = setInterval(() => {
    notificationStore.notifications.forEach((notification: any) => {
      const notificationAge = Date.now() - notification.id;
      if (notificationAge > 5000) { // 5秒后自动移除
        notificationStore.removeNotification(notification.id);
      }
    });
  }, 1000);

  // 清理定时器
  return () => clearInterval(autoRemoveInterval);
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  min-width: 300px;
}

.notification-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.notification-item.success {
  background: rgba(103, 194, 58, 0.9);
  border-color: rgba(103, 194, 58, 0.3);
}

.notification-item.error {
  background: rgba(245, 108, 108, 0.9);
  border-color: rgba(245, 108, 108, 0.3);
}

.notification-item.warning {
  background: rgba(230, 162, 60, 0.9);
  border-color: rgba(230, 162, 60, 0.3);
}

.notification-item.info {
  background: rgba(64, 158, 255, 0.9);
  border-color: rgba(64, 158, 255, 0.3);
}

.notification-icon {
  flex-shrink: 0;
  font-size: 20px;
  color: white;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  color: white;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.notification-close {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.notification-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* 动画效果 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification-list {
    max-width: none;
  }
  
  .notification-item {
    min-width: auto;
  }
}
</style> 