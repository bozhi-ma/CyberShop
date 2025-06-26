/**
 * 商品图片组件
 * 统一处理商品图片的显示、加载状态、错误处理等
 */

<template>
  <div class="product-image-container" :class="{ 'loading': loading, 'error': hasError }">
    <!-- 图片加载状态 -->
    <div v-if="loading" class="image-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span class="loading-text">加载中...</span>
    </div>
    
    <!-- 图片错误状态 -->
    <div v-if="hasError && !loading" class="image-error">
      <el-icon><Picture /></el-icon>
      <span class="error-text">图片加载失败</span>
    </div>
    
    <!-- 实际图片 -->
    <img 
      v-show="!loading && !hasError"
      :src="currentImageUrl" 
      :alt="alt" 
      class="product-image"
      @error="handleImageError"
      @load="handleImageLoad"
      :style="imageStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Loading, Picture } from '@element-plus/icons-vue';
import { getDefaultImage, loadImage, isValidImageFormat } from '../utils/imageUtils';

interface Props {
  src?: string;
  alt?: string;
  category?: string;
  width?: number | string;
  height?: number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '商品图片',
  category: '',
  width: '100%',
  height: '100%',
  fit: 'cover',
  lazy: false
});

// 响应式数据
const loading = ref(true);
const hasError = ref(false);
const currentImageUrl = ref('');

// 计算属性
const imageStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  objectFit: props.fit
}));

// 方法
const handleImageError = async () => {
  hasError.value = true;
  loading.value = false;
  
  // 尝试加载默认图片
  const defaultUrl = getDefaultImage(props.category);
  if (defaultUrl !== currentImageUrl.value) {
    currentImageUrl.value = defaultUrl;
    loading.value = true;
    hasError.value = false;
  }
};

const handleImageLoad = () => {
  loading.value = false;
  hasError.value = false;
};

const loadImageUrl = async (url: string) => {
  if (!url || !isValidImageFormat(url)) {
    currentImageUrl.value = getDefaultImage(props.category);
    return;
  }

  loading.value = true;
  hasError.value = false;
  
  try {
    const result = await loadImage(url);
    currentImageUrl.value = result.url;
    if (!result.success) {
      hasError.value = true;
    }
  } catch (error) {
    hasError.value = true;
    currentImageUrl.value = getDefaultImage(props.category);
  } finally {
    loading.value = false;
  }
};

// 监听src变化
watch(() => props.src, (newSrc) => {
  if (newSrc !== currentImageUrl.value) {
    loadImageUrl(newSrc);
  }
}, { immediate: true });

// 组件挂载时加载图片
onMounted(() => {
  if (!props.src) {
    currentImageUrl.value = getDefaultImage(props.category);
    loading.value = false;
  }
});
</script>

<style scoped>
.product-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  transition: opacity 0.3s ease;
}

.image-loading,
.image-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 2;
}

.image-loading .el-icon {
  font-size: 24px;
  color: #00fff7;
}

.image-error .el-icon {
  font-size: 24px;
  color: #ff6b6b;
}

.loading-text,
.error-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.product-image-container.loading .product-image {
  opacity: 0.3;
}

.product-image-container.error .product-image {
  opacity: 0.1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-loading .el-icon,
  .image-error .el-icon {
    font-size: 20px;
  }
  
  .loading-text,
  .error-text {
    font-size: 11px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .product-image-container {
    background: rgba(0, 0, 0, 0.2);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .product-image-container {
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .product-image {
    transition: none;
  }
}
</style> 