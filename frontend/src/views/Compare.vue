/**
 * 商品对比页面
 * 实现多商品参数对比、批量操作、导出等功能
 */

<template>
  <div class="compare-container">
    <div class="page-header">
      <h1 class="page-title">商品对比</h1>
      <el-button @click="router.push('/')" type="primary" round>返回首页</el-button>
    </div>

    <div v-if="compareList.length === 0" class="empty-state">
      <el-empty description="您还没有添加任何商品进行对比">
        <el-button type="primary" @click="router.push('/products')">去挑选商品</el-button>
      </el-empty>
    </div>

    <div v-else class="compare-table-container">
      <el-table :data="transposedData" style="width: 100%" class="compare-table">
        <el-table-column prop="feature" label="特性" width="180" fixed />
        <el-table-column v-for="(product, index) in compareList" :key="product.id" :label="product.name">
          <template #default="scope">
            <div v-if="scope.row.feature === '商品图片'">
              <el-image :src="product.image" fit="contain" style="width: 100px; height: 100px;" />
            </div>
            <div v-else-if="scope.row.feature === '操作'">
               <el-button size="small" type="danger" @click="removeFromCompare(product.id)">移除</el-button>
            </div>
            <span v-else>{{ scope.row[`product_${index}`] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="clear-all-container">
        <el-button @click="clearCompare" type="danger" plain>清空对比列表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCompareStore } from '../store/compare';
import { useNotificationStore } from '../store/notification';

const router = useRouter();
const compareStore = useCompareStore();
const notificationStore = useNotificationStore();

const { compareList, toggleCompare, clearCompare } = compareStore;

const features = [
  { key: 'image', name: '商品图片' },
  { key: 'price', name: '价格' },
  { key: 'rating', name: '评分' },
  { key: 'sales', name: '销量' },
  { key: 'brand', name: '品牌' },
  { key: 'category', name: '分类' },
  { key: 'action', name: '操作' },
];

const transposedData = computed(() => {
  return features.map(feature => {
    const row: { [key: string]: any } = { feature: feature.name };
    compareList.forEach((product, index) => {
      row[`product_${index}`] = product[feature.key] || '-';
    });
    return row;
  });
});

const removeFromCompare = (productId: number) => {
    const product = compareList.find(p => p.id === productId);
    if(product){
        toggleCompare(product);
        notificationStore.addNotification({
            message: `${product.name} 已从对比列表中移除`,
            type: 'success'
        });
    }
};

</script>

<style scoped>
.compare-container {
  max-width: 1400px;
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
.page-header .el-button {
  position: absolute;
  right: 0;
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
.compare-table-container {
  background: rgba(30, 30, 50, 0.8);
  border-radius: 12px;
  padding: 24px;
}
.compare-table {
  --el-table-border-color: rgba(0, 255, 247, 0.2);
  --el-table-header-bg-color: rgba(0, 255, 247, 0.1);
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 255, 247, 0.05);
}
.clear-all-container {
    text-align: center;
    margin-top: 24px;
}
</style> 