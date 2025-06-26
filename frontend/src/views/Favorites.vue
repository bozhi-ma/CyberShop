<template>
  <div class="favorites-container">
    <div class="page-header">
      <h1 class="page-title">我的收藏</h1>
      <div class="header-buttons">
        <el-button @click="$router.push('/user')" type="primary" round>返回用户中心</el-button>
        <el-button @click="$router.push('/')" type="primary" round>返回首页</el-button>
      </div>
    </div>
    <div v-if="favoriteList.length === 0" class="empty-state">
      <el-empty description="您的收藏夹是空的">
        <el-button type="primary" @click="goToProducts">去逛逛</el-button>
      </el-empty>
    </div>
    <div v-else class="favorites-grid">
      <ProductCard 
        v-for="product in favoriteList" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '../store/favorite';
import ProductCard from '../components/ProductCard.vue';

const router = useRouter();
const favoriteStore = useFavoriteStore();

const favoriteList = computed(() => favoriteStore.favoriteList);

const goToProducts = () => {
  router.push('/products');
};

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.page-title {
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 255, 247, 0.3);
}

.page-header .header-buttons {
  position: absolute;
  right: 0;
  display: flex;
  gap: 12px;
}

.empty-state {
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(30, 30, 50, 0.5);
  border-radius: 16px;
  padding: 40px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
</style> 