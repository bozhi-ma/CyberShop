/**
 * 根组件 App.vue
 * 定义全局布局、路由出口、全局样式等
 */

<template>
  <div id="app">
    <!-- 跳过链接 - 为键盘用户提供快速导航 -->
    <a href="#main-content" class="skip-link">
      跳转到主要内容
    </a>
    
    <!-- 主要内容区域 -->
    <main id="main-content" role="main">
      <router-view />
    </main>
    
    <!-- 全局通知区域 -->
    <div 
      id="notifications" 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      class="sr-only"
    >
      <!-- 通知内容将通过 JavaScript 动态插入 -->
    </div>
    
    <!-- 通知弹窗组件 -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import NotificationToast from './components/NotificationToast.vue';

// 页面加载完成后的无障碍访问优化
onMounted(() => {
  // 设置页面标题
  document.title = 'CyberShop - 未来购物体验';
  
  // 设置页面语言
  document.documentElement.lang = 'zh-CN';
  
  // 添加页面描述
  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = 'CyberShop - AI驱动的智能购物平台，体验AR试用、智能推荐、数据分析等创新功能';
  document.head.appendChild(metaDescription);
  
  // 添加主题色（仅在支持的浏览器中）
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#1a1a2e';
    document.head.appendChild(themeColor);
  }
  
  // 添加无障碍访问相关的 meta 标签
  if (!document.querySelector('meta[name="accessibility"]')) {
    const accessibilityMeta = document.createElement('meta');
    accessibilityMeta.name = 'accessibility';
    accessibilityMeta.content = 'accessible';
    document.head.appendChild(accessibilityMeta);
  }
  
  // 监听路由变化，更新页面标题
  const updatePageTitle = (to: any) => {
    const titles: Record<string, string> = {
      '/': 'CyberShop - 首页',
      '/products': 'CyberShop - 商品列表',
      '/analysis': 'CyberShop - 数据分析',
      '/compare': 'CyberShop - 商品对比',
      '/ar': 'CyberShop - AR试用',
      '/user': 'CyberShop - 用户中心',
      '/login': 'CyberShop - 登录',
      '/register': 'CyberShop - 注册'
    };
    
    document.title = titles[to.path] || 'CyberShop - 未来购物体验';
  };
  
  // 监听路由变化
  if (window.location.pathname) {
    updatePageTitle({ path: window.location.pathname });
  }
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 跳过链接样式 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
  font-weight: bold;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
  outline: 2px solid #409eff;
  outline-offset: 2px;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .skip-link:focus {
    outline-width: 3px;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
  
  .logo {
    transition: none;
  }
}

/* 屏幕阅读器专用样式 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
