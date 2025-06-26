/**
 * 首页
 * 展示平台核心功能、热门商品、数据统计、创新技术等
 */

<template>
  <div class="home">
    <NavBar />
    
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="cyber-text">CyberShop</span>
            <br>未来购物体验
          </h1>
          <p class="hero-subtitle">
            探索AI驱动的智能购物平台，体验AR试用、智能推荐、数据分析等创新功能
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="$router.push('/products')">
              开始购物
            </el-button>
            <el-button size="large" @click="$router.push('/ar')">
              体验AR
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="cyber-grid">
            <div class="grid-item" v-for="i in 9" :key="i"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色区域 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <el-icon :size="32">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门商品区域 -->
    <section class="products-section">
      <div class="container">
        <h2 class="section-title">热门商品</h2>
        <div class="products-grid">
          <div class="product-card" v-for="product in hotProducts" :key="product.id">
            <div class="product-image">
              <img :src="product.imageUrl" :alt="product.name" />
              <div class="product-overlay">
                <el-button type="primary" size="small" @click="goToDetail(product.id)">查看详情</el-button>
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
              <div class="product-rating">
                <el-rate v-model="product.rating" disabled show-score />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计区域 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.id">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 创新技术区域 -->
    <section class="tech-section">
      <div class="container">
        <h2 class="section-title">创新技术</h2>
        <div class="tech-grid">
          <div class="tech-card" v-for="tech in technologies" :key="tech.id">
            <div class="tech-icon">
              <el-icon :size="40">
                <component :is="tech.icon" />
              </el-icon>
            </div>
            <h3>{{ tech.title }}</h3>
            <p>{{ tech.description }}</p>
            <el-button type="text" @click="$router.push(tech.link)">
              了解更多 →
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ShoppingCart, 
  DataAnalysis, 
  View, 
  Camera,
  Star,
  TrendCharts,
  Connection,
  Monitor
} from '@element-plus/icons-vue';
import NavBar from '../components/NavBar.vue';
import { useProductStore } from '../store/product';
import type { Product } from '../types/product';

const router = useRouter();
const productStore = useProductStore();
const hotProducts = ref<Product[]>([]);

// 功能特色数据
const features = ref([
  {
    id: 1,
    title: '智能推荐',
    description: '基于AI算法的个性化商品推荐',
    icon: 'Star'
  },
  {
    id: 2,
    title: 'AR试用',
    description: '虚拟试戴和3D商品展示',
    icon: 'Camera'
  },
  {
    id: 3,
    title: '数据分析',
    description: '实时销售数据和用户行为分析',
    icon: 'DataAnalysis'
  },
  {
    id: 4,
    title: '商品对比',
    description: '多维度参数对比和智能选择',
    icon: 'View'
  }
]);

onMounted(async () => {
  await productStore.fetchProducts({ page: 1, limit: 20, sortBy: 'sales' }); // 先多取一些
  const highendCategories = [
    'laptops', 'mens-watches', 'mobile-accessories', 'kitchen-accessories', 'furniture', 'home-decoration', 'groceries', 'fragrances', 'beauty'
  ];
  hotProducts.value = productStore.products
    .filter(item =>
      highendCategories.includes(item.category) && (item.price || 0) > 1000
    )
    .map(item => ({
      ...item,
      imageUrl: item.imageUrl || (item as any).image
    }))
    .slice(0, 4);
});

// 统计数据
const stats = ref([
  { id: 1, value: '10K+', label: '注册用户' },
  { id: 2, value: '50K+', label: '商品数量' },
  { id: 3, value: '99.9%', label: '系统可用性' },
  { id: 4, value: '24/7', label: '在线服务' }
]);

// 创新技术数据
const technologies = ref([
  {
    id: 1,
    title: '人工智能',
    description: '深度学习算法驱动的智能推荐系统',
    icon: 'Connection',
    link: '/analysis'
  },
  {
    id: 2,
    title: '增强现实',
    description: 'AR技术实现虚拟试戴和3D展示',
    icon: 'Camera',
    link: '/ar'
  },
  {
    id: 3,
    title: '大数据分析',
    description: '实时数据处理和可视化分析',
    icon: 'TrendCharts',
    link: '/analysis'
  }
]);

const goToDetail = (id: string | number) => {
  router.push(`/product/${id}`);
};
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,255,247,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 400px;
  z-index: 1;
  position: relative;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.cyber-text {
  background: linear-gradient(45deg, #00fff7, #ff0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cyber-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 300px;
}

.grid-item {
  width: 80px;
  height: 80px;
  background: rgba(0, 255, 247, 0.1);
  border: 1px solid rgba(0, 255, 247, 0.3);
  border-radius: 8px;
  animation: pulse 2s infinite;
}

.grid-item:nth-child(even) {
  animation-delay: 0.5s;
}

/* 功能特色区域 */
.features-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.02);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 3rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(45deg, #00fff7, #ff0080);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 255, 247, 0.3);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #00fff7, #ff0080);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feature-card h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* 热门商品区域 */
.products-section {
  padding: 80px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.product-price {
  color: #00fff7;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-rating {
  margin-top: 0.5rem;
}

/* 数据统计区域 */
.stats-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #00fff7, #ff0080);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 创新技术区域 */
.tech-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.02);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tech-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 255, 247, 0.3);
}

.tech-icon {
  color: #00fff7;
  margin-bottom: 1.5rem;
}

.tech-card h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.tech-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .products-grid,
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cyber-grid {
    max-width: 200px;
  }
  
  .grid-item {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}
</style> 