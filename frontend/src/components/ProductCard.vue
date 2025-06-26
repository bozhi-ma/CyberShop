/**
 * 商品卡片组件
 * 展示商品图片、信息、操作按钮等，支持卡片/列表两种视图
 */

<template>
  <div class="product-card" :class="{ 'list-view': isListView }">
    <!-- 商品图片区域 -->
    <div class="product-image">
      <img 
        :src="productImage" 
        :alt="product.name" 
        class="product-img"
        @error="handleImageError"
        @load="handleImageLoad"
        :class="{ 'loading': imageLoading }"
      />
      
      <!-- 图片加载状态 -->
      <div v-if="imageLoading" class="image-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      
      <!-- 图片遮罩层 -->
      <div class="image-overlay">
        <div class="overlay-actions">
          <el-button 
            type="primary" 
            size="small" 
            circle
            @click="viewDetail"
            title="查看详情"
          >
            <el-icon><View /></el-icon>
          </el-button>
          <el-button 
            type="success" 
            size="small" 
            circle
            @click="enhancedAddToCart(product)"
            title="加入购物车"
          >
            <el-icon><ShoppingCart /></el-icon>
          </el-button>
          <el-button 
            :type="isFavorite(product.id) ? 'warning' : 'info'" 
            size="small" 
            circle
            @click="handleFavoriteClick(product)"
            :title="isFavorite(product.id) ? '取消收藏' : '收藏商品'"
          >
            <el-icon><StarFilled v-if="isFavorite(product.id)" /><Star v-else /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 商品标签 -->
      <div class="product-badges">
        <span v-if="product.isNew" class="badge new">新品</span>
        <span v-if="product.discount" class="badge discount">{{ product.discount }}% OFF</span>
        <span v-if="product.isHot" class="badge hot">热销</span>
      </div>
    </div>

    <!-- 商品信息区域 -->
    <div class="product-content">
      <div class="product-header">
        <h3 class="product-title" v-html="highlight(product.name)"></h3>
        <div class="product-rating">
          <el-rate 
            v-model="product.rating" 
            disabled 
            show-score 
            text-color="#ff9900"
            score-template="{value}"
          />
        </div>
      </div>

      <div class="product-description" v-html="highlight(truncateDescription(product.description))"></div>

      <div class="product-meta">
        <div class="product-price">
          <span class="current-price">¥{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="original-price">
            ¥{{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <div class="product-stats">
          <span class="stat-item">
            <el-icon><ShoppingCart /></el-icon>
            {{ product.sales || 0 }} 已售
          </span>
          <span class="stat-item">
            <el-icon><ChatDotRound /></el-icon>
            {{ product.reviews || 0 }} 评价
          </span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="product-actions">
        <el-button 
          type="primary" 
          size="small" 
          @click="viewDetail"
          class="action-btn"
        >
          查看详情
        </el-button>
        
        <div class="secondary-actions">
          <el-button 
            type="success" 
            size="small" 
            @click="enhancedAddToCart(product)"
            class="action-btn"
          >
            加入购物车
          </el-button>
          <el-button 
            :type="isInCompare(product.id) ? 'primary' : 'info'" 
            size="small" 
            @click="handleCompareClick(product)"
            class="action-btn"
            :title="isInCompare(product.id) ? '从对比中移除' : '加入对比'"
          >
            {{ isInCompare(product.id) ? '已对比' : '对比' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  View, 
  ShoppingCart, 
  Star, 
  ChatDotRound,
  Loading,
  StarFilled
} from '@element-plus/icons-vue';
import { useCartStore } from '../store/cart';
import { useCompareStore } from '../store/compare';
import { useFavoriteStore } from '../store/favorite';
import { useNotificationStore } from '../store/notification';
import { getDefaultImage, loadImage } from '../utils/imageUtils';

// 组件props定义
// @prop product 商品对象
// @prop isListView 是否为列表视图
// @prop keyword 关键词

const props = defineProps<{ 
  product: any;
  isListView?: boolean;
  keyword?: string;
}>();

const router = useRouter();
const cartStore = useCartStore();
const compareStore = useCompareStore();
const favoriteStore = useFavoriteStore();
const notificationStore = useNotificationStore();

const { addToCart } = cartStore;
const { toggleCompare, isInCompare, compareList } = compareStore;
const { toggleFavorite, isFavorite } = favoriteStore;
const { addNotification } = notificationStore;

// 响应式数据
const imageLoading = ref(true);
const imageError = ref(false);

// 计算属性
const isListView = computed(() => props.isListView);

// 商品图片URL计算
const productImage = computed(() => {
  if (imageError.value) {
    return getDefaultImage(props.product.category);
  }
  return props.product.image || getDefaultImage(props.product.category);
});

// 高亮关键词方法
function highlight(text: string) {
  if (!props.keyword || !text) return text;
  const reg = new RegExp(`(${props.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(reg, '<span class="highlight-keyword">$1</span>');
}

// 方法
const viewDetail = () => {
  router.push(`/product/${props.product.id}`);
};

const truncateDescription = (text: string, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN');
};

const handleImageError = async (event: Event) => {
  const target = event.target as HTMLImageElement;
  imageError.value = true;
  imageLoading.value = false;
  
  // 尝试加载默认图片
  const result = await loadImage(getDefaultImage(props.product.category));
  target.src = result.url;
};

const handleImageLoad = () => {
  imageLoading.value = false;
  imageError.value = false;
};

// 收藏按钮点击处理
const handleFavoriteClick = (product: any) => {
  const isNowFavorite = toggleFavorite(product);
  addNotification({
    message: isNowFavorite ? `已将 ${product.name} 加入收藏` : `已将 ${product.name} 移出收藏`,
    type: 'success'
  });
};

const handleCompareClick = (product: any) => {
  if (!isInCompare(product.id) && compareList.length >= 4) {
    addNotification({
      message: '最多只能添加4个商品进行对比',
      type: 'warning'
    });
    return;
  }
  const isNowInCompare = toggleCompare(product);
  addNotification({
    message: isNowInCompare ? `已将 ${product.name} 加入对比` : `已将 ${product.name} 移出对比`,
    type: 'success'
  });
};

// 增强的添加方法
const enhancedAddToCart = (product: any) => {
  addToCart(product);
  addNotification({ message: `已将 ${product.name} 加入购物车`, type: 'success' });
};
</script>

<style scoped>
.product-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 255, 247, 0.3);
}

/* 列表视图样式 */
.product-card.list-view {
  flex-direction: row;
  height: auto;
}

.product-card.list-view .product-image {
  width: 200px;
  flex-shrink: 0;
}

.product-card.list-view .product-content {
  flex: 1;
  padding: 20px;
}

.product-card.list-view .product-description {
  display: block;
  margin: 12px 0;
}

/* 图片区域 */
.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-img.loading {
  opacity: 0.3;
}

.product-card:hover .product-img {
  transform: scale(1.1);
}

/* 图片加载状态 */
.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: #00fff7;
  font-size: 24px;
}

/* 图片遮罩层 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 12px;
}

/* 商品标签 */
.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.badge.new {
  background: linear-gradient(45deg, #00fff7, #00b8ff);
}

.badge.discount {
  background: linear-gradient(45deg, #ff0080, #ff6b6b);
}

.badge.hot {
  background: linear-gradient(45deg, #ff9900, #ff6b6b);
}

/* 内容区域 */
.product-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-header {
  margin-bottom: 12px;
}

.product-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-rating {
  margin-bottom: 8px;
}

.product-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 12px 0;
  display: none;
}

.product-meta {
  margin-bottom: 16px;
  flex: 1;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  color: #00fff7;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
  font-size: 0.9rem;
}

.product-stats {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 操作按钮 */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
}

.secondary-actions {
  display: flex;
  gap: 8px;
}

.secondary-actions .action-btn {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-card.list-view {
    flex-direction: column;
  }
  
  .product-card.list-view .product-image {
    width: 100%;
  }
  
  .product-card.list-view .product-content {
    padding: 16px;
  }
  
  .product-description {
    display: block;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .product-stats {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 160px;
  }
  
  .product-title {
    font-size: 1rem;
  }
  
  .current-price {
    font-size: 1.1rem;
  }
  
  .overlay-actions {
    gap: 8px;
  }
  
  .overlay-actions .el-button {
    width: 36px;
    height: 36px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .product-card {
    background: rgba(0, 0, 0, 0.3);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .product-card {
    border-width: 2px;
  }
  
  .badge {
    border: 1px solid white;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-img,
  .image-overlay {
    transition: none;
  }
  
  .product-card:hover {
    transform: none;
  }
  
  .product-card:hover .product-img {
    transform: none;
  }
}

/* 焦点样式 */
.product-card:focus-within {
  outline: 2px solid #00fff7;
  outline-offset: 2px;
}

/* 加载状态 */
.product-card.loading {
  pointer-events: none;
}

.product-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.product-card.loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 255, 247, 0.3);
  border-top: 3px solid #00fff7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 11;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.product-card .highlight-keyword {
  background: #00fff7;
  color: #fff;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: bold;
}
</style> 