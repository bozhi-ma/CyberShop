<template>
  <div class="product-detail-container">
    <el-button class="back-home-btn" type="default" @click="$router.push('/')">返回首页</el-button>
    <div v-if="loading" class="loading-container">
      <SkeletonLoader />
    </div>
    <div v-else-if="error" class="error-container">
      <el-alert
        title="加载失败"
        type="error"
        :description="error"
        show-icon
        :closable="false"
      />
      <el-button @click="fetchProductData" class="retry-button">重试</el-button>
    </div>
    <div v-else-if="product" class="product-detail-content">
      <el-row :gutter="40">
        <el-col :md="12" class="product-gallery">
          <el-image :src="product.image" fit="cover" class="main-image" />
        </el-col>
        <el-col :md="12" class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-meta">
            <el-rate
              v-model="product.rating"
              disabled
              show-score
              score-template="{value} 星"
            />
            <span class="meta-divider">|</span>
            <span>{{ product.reviews || 0 }} 条评价</span>
            <span class="meta-divider">|</span>
            <span>{{ product.sales || 0 }} 已售</span>
          </div>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-price">
            <span class="current-price">¥{{ product.price?.toLocaleString() }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ¥{{ product.originalPrice.toLocaleString() }}
            </span>
          </div>
          <div class="product-actions">
            <el-button type="primary" size="large" @click="addToCart(product)">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button size="large" @click="buyNow(product)">立即购买</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductDetail } from '../api/product';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import { ShoppingCart } from '@element-plus/icons-vue';
import { useCartStore } from '../store/cart';
import { useNotificationStore } from '../store/notification';

const route = useRoute();
const cartStore = useCartStore();
const notificationStore = useNotificationStore();

const product = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchProductData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const productId = route.params.id as string;
    if (productId) {
      const response = await getProductDetail(Number(productId));
      product.value = response;
    } else {
      throw new Error('未找到商品ID');
    }
  } catch (err: any) {
    error.value = err.message || '获取商品信息失败，请稍后再试。';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const addToCart = (product: any) => {
  cartStore.addToCart(product);
  notificationStore.addNotification({
    type: 'success',
    message: `${product.name} 已成功加入购物车！`,
  });
};

const buyNow = (product: any) => {
  // 实际项目中会跳转到订单确认页
  cartStore.addToCart(product);
  notificationStore.addNotification({
    type: 'info',
    message: `正在准备购买 ${product.name}...`,
  });
  // router.push('/checkout');
};

onMounted(() => {
  fetchProductData();
});
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 24px;
  background: rgba(30, 30, 50, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.loading-container, .error-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-container {
  text-align: center;
}
.retry-button {
  margin-top: 20px;
}

.product-gallery .main-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.product-info {
  color: #fff;
}

.product-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 255, 247, 0.3);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #ccc;
}

.meta-divider {
  opacity: 0.5;
}

.product-description {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 24px;
  color: #eee;
}

.product-price {
  margin-bottom: 32px;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
}

.current-price {
  font-size: 2.2rem;
  font-weight: bold;
  color: #00fff7;
}

.original-price {
  font-size: 1rem;
  margin-left: 12px;
  text-decoration: line-through;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 16px;
}

.back-home-btn {
  position: fixed;
  right: 48px;
  bottom: 48px;
  z-index: 1000;
  background: #232334;
  color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  padding: 12px 28px;
  font-size: 1.1rem;
  transition: box-shadow 0.2s;
}
.back-home-btn:hover {
  box-shadow: 0 4px 16px rgba(0,255,247,0.18);
  background: #2a2a44;
}
</style> 