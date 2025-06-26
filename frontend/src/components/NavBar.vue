/**
 * 顶部导航栏组件
 * 提供全局导航、菜单、用户入口等
 */

<template>
  <nav class="navbar" role="navigation" aria-label="主导航">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-logo">
        <h2 class="logo-text">CyberShop</h2>
      </div>

      <!-- 移动端菜单按钮 -->
      <button 
        class="nav-toggle" 
        @click="toggleMenu" 
        :class="{ active: isMenuOpen }"
        :aria-expanded="isMenuOpen"
        :aria-controls="menuId"
        :aria-label="isMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
        title="切换导航菜单"
      >
        <span class="sr-only">{{ isMenuOpen ? '关闭菜单' : '打开菜单' }}</span>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- 导航菜单 -->
      <div 
        class="nav-menu" 
        :class="{ active: isMenuOpen }"
        :id="menuId"
        role="menubar"
        aria-label="主导航菜单"
      >
        <el-menu 
          :default-active="activeIndex" 
          mode="horizontal" 
          background-color="transparent" 
          text-color="#fff" 
          active-text-color="#00fff7"
          class="nav-menu-list"
          role="menubar"
          aria-label="主导航菜单"
        >
          <el-menu-item 
            index="/" 
            @click="navigateTo('/')"
            role="menuitem"
            aria-label="首页"
            title="首页"
          >
            首页
          </el-menu-item>
          <el-menu-item 
            index="/products" 
            @click="navigateTo('/products')"
            role="menuitem"
            aria-label="商品列表"
            title="商品列表"
          >
            商品列表
          </el-menu-item>
          <el-menu-item 
            index="/analysis" 
            @click="navigateTo('/analysis')"
            role="menuitem"
            aria-label="数据分析"
            title="数据分析"
          >
            数据分析
          </el-menu-item>
          <el-menu-item 
            index="/compare" 
            @click="navigateTo('/compare')"
            role="menuitem"
            aria-label="商品对比"
            title="商品对比"
          >
            商品对比
          </el-menu-item>
          <el-menu-item 
            index="/ar" 
            @click="navigateTo('/ar')"
            role="menuitem"
            aria-label="AR试用"
            title="AR试用"
          >
            AR试用
          </el-menu-item>
          <el-menu-item 
            index="/favorites" 
            @click="navigateTo('/favorites')"
            role="menuitem"
            aria-label="收藏"
            title="收藏"
          >
            收藏
          </el-menu-item>
          <template v-if="!isLoggedIn">
            <el-menu-item 
              index="/user" 
              @click="navigateTo('/user')"
              role="menuitem"
              aria-label="用户中心"
              title="用户中心"
            >
              用户中心
            </el-menu-item>
            <el-menu-item 
              index="/login" 
              @click="navigateTo('/login')"
              role="menuitem"
              aria-label="登录"
              title="登录"
            >
              登录
            </el-menu-item>
            <el-menu-item 
              index="/register" 
              @click="navigateTo('/register')" 
              class="register-menu"
              role="menuitem"
              aria-label="注册"
              title="注册"
            >
              注册
            </el-menu-item>
          </template>
          <template v-else>
            <el-sub-menu index="/user-menu">
              <template #title>
                <el-avatar :size="24" :src="userInfo?.avatar || defaultAvatar" style="margin-right: 8px;"></el-avatar>
                <span>欢迎, {{ userInfo?.username }}</span>
              </template>
              <el-menu-item index="/user" @click="navigateTo('/user')">个人中心</el-menu-item>
              <el-menu-item index="/logout" @click="handleLogout">切换账户</el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
        
        <!-- 搜索栏 -->
        <div class="search-container" role="search" aria-label="搜索商品">
          <SearchBar />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SearchBar from './SearchBar.vue';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userInfo = computed(() => userStore.userInfo);

// 默认头像
const defaultAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');

const handleLogout = () => {
  userStore.logout();
};

const router = useRouter();
const route = useRoute();
const activeIndex = computed(() => route.path); // 绑定当前路由
const isMenuOpen = ref(false);
const menuId = ref('nav-menu-' + Math.random().toString(36).substr(2, 9));

// 导航方法
const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
  isMenuOpen.value = false; // 移动端点击后关闭菜单
};

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.navbar')) {
    isMenuOpen.value = false;
  }
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false;
  }
};

// 键盘导航支持
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.navbar {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 255, 247, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
}

.nav-logo {
  flex-shrink: 0;
  margin-right: 40px;
  display: flex;
  align-items: center;
}

.logo-text {
  color: #00fff7;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  gap: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-toggle:hover {
  background-color: rgba(0, 255, 247, 0.1);
}

.nav-toggle:focus {
  outline: 2px solid #00fff7;
  outline-offset: 2px;
}

.nav-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background: #00fff7;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.nav-menu-list {
  border: none;
  background: transparent;
}

.nav-menu-list .el-menu-item {
  color: #fff;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0 4px;
}

.nav-menu-list .el-menu-item:hover {
  background: rgba(0, 255, 247, 0.1);
  color: #00fff7;
  transform: translateY(-2px);
}

.nav-menu-list .el-menu-item:focus {
  outline: 2px solid #00fff7;
  outline-offset: 2px;
}

.nav-menu-list .el-menu-item.is-active {
  background: rgba(0, 255, 247, 0.2);
  color: #00fff7;
  box-shadow: 0 0 15px rgba(0, 255, 247, 0.3);
}

.search-container {
  flex-shrink: 0;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(26, 26, 46, 0.98);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(0, 255, 247, 0.2);
  }
  
  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-menu-list {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-menu-list .el-menu-item {
    margin: 4px 0;
    text-align: center;
    border-radius: 8px;
  }
  
  .search-container {
    width: 100%;
    margin-top: 15px;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 10px;
  }
  
  .nav-menu {
    padding: 15px;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
}

/* 动画效果 */
.navbar {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 滚动效果 */
.navbar.scrolled {
  background: rgba(26, 26, 46, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(26, 26, 46, 0.98);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .nav-menu-list .el-menu-item {
    border: 1px solid transparent;
  }
  
  .nav-menu-list .el-menu-item:hover {
    border-color: #00fff7;
  }
  
  .nav-toggle:focus {
    outline-width: 3px;
  }
  
  .nav-menu-list .el-menu-item:focus {
    outline-width: 3px;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .navbar,
  .nav-menu,
  .nav-menu-list .el-menu-item,
  .nav-toggle span {
    transition: none;
  }
  
  .navbar {
    animation: none;
  }
  
  .nav-menu-list .el-menu-item:hover {
    transform: none;
  }
}

.register-menu {
  color: #00fff7 !important;
  font-weight: bold;
  background: rgba(0,255,247,0.08);
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}
.register-menu:hover {
  background: rgba(0,255,247,0.18);
  color: #fff !important;
}

/* 修复下拉菜单样式 */
:deep(.el-menu--popup) {
  background: rgba(26, 26, 46, 0.98) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 247, 0.2) !important;
  border-radius: 8px;
  padding: 6px;
}

:deep(.el-sub-menu .el-menu-item) {
  color: #fff;
  transition: all 0.3s ease;
  border-radius: 6px;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background: rgba(0, 255, 247, 0.1);
  color: #00fff7;
}
</style> 