<template>
  <div class="skeleton-loader" :class="type">
    <!-- 商品卡片骨架屏 -->
    <div v-if="type === 'product-card'" class="skeleton-product-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-price"></div>
        <div class="skeleton-rating"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- 列表骨架屏 -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </div>

    <!-- 表格骨架屏 -->
    <div v-else-if="type === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in columns" :key="i" class="skeleton-header-cell"></div>
      </div>
      <div v-for="row in rows" :key="row" class="skeleton-table-row">
        <div v-for="col in columns" :key="col" class="skeleton-table-cell"></div>
      </div>
    </div>

    <!-- 详情页骨架屏 -->
    <div v-else-if="type === 'detail'" class="skeleton-detail">
      <div class="skeleton-detail-header">
        <div class="skeleton-detail-image"></div>
        <div class="skeleton-detail-info">
          <div class="skeleton-detail-title"></div>
          <div class="skeleton-detail-price"></div>
          <div class="skeleton-detail-rating"></div>
          <div class="skeleton-detail-actions">
            <div class="skeleton-button"></div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      </div>
      <div class="skeleton-detail-content">
        <div class="skeleton-detail-section">
          <div class="skeleton-section-title"></div>
          <div class="skeleton-section-content"></div>
        </div>
        <div class="skeleton-detail-section">
          <div class="skeleton-section-title"></div>
          <div class="skeleton-section-content"></div>
        </div>
      </div>
    </div>

    <!-- 默认骨架屏 -->
    <div v-else class="skeleton-default">
      <div v-for="i in count" :key="i" class="skeleton-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'product-card' | 'list' | 'table' | 'detail' | 'default'
  count?: number
  columns?: number
  rows?: number
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  count: 3,
  columns: 4,
  rows: 5
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* 动画效果 */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* skeleton-base 样式 */
.skeleton-base-style {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 商品卡片骨架屏 */
.skeleton-product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  height: 20px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-price {
  height: 24px;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-rating {
  height: 16px;
  width: 40%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-button {
  height: 36px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

/* 列表骨架屏 */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  flex-shrink: 0;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

/* 表格骨架屏 */
.skeleton-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: 1px;
  background: #f0f0f0;
}

.skeleton-header-cell {
  height: 48px;
  background: white;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: 1px;
  background: #f0f0f0;
}

.skeleton-table-cell {
  height: 56px;
  background: white;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 详情页骨架屏 */
.skeleton-detail {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.skeleton-detail-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.skeleton-detail-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-detail-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-detail-title {
  height: 32px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-detail-price {
  height: 28px;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-detail-rating {
  height: 20px;
  width: 40%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.skeleton-detail-actions .skeleton-button {
  flex: 1;
  height: 44px;
}

.skeleton-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-detail-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-section-title {
  height: 24px;
  width: 30%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-section-content {
  height: 120px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 默认骨架屏 */
.skeleton-default {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-default .skeleton-line {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-default .skeleton-line:nth-child(2) {
  width: 80%;
}

.skeleton-default .skeleton-line:nth-child(3) {
  width: 60%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-detail-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .skeleton-detail-image {
    height: 250px;
  }
  
  .skeleton-detail-actions {
    flex-direction: column;
  }
  
  .skeleton-table-header,
  .skeleton-table-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .skeleton-product-card {
    padding: 12px;
  }
  
  .skeleton-image {
    height: 150px;
  }
  
  .skeleton-table-header,
  .skeleton-table-row {
    grid-template-columns: 1fr;
  }
}
</style> 