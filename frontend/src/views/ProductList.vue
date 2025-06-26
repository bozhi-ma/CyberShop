<template>
  <div class="product-list">
    <NavBar />
    
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">商品列表</h1>
        <p class="page-subtitle">发现优质商品，享受智能购物体验</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="container">
        <!-- 筛选和排序工具栏 -->
        <div class="toolbar" role="toolbar" aria-label="商品筛选和排序工具">
          <div class="toolbar-left">
            <!-- 视图切换 -->
            <div class="view-toggle" role="group" aria-label="视图模式选择">
              <el-button-group>
                <el-button 
                  :type="viewMode === 'grid' ? 'primary' : 'default'"
                  @click="viewMode = 'grid'"
                  size="small"
                  :aria-pressed="viewMode === 'grid'"
                  aria-label="网格视图"
                  title="切换到网格视图"
                >
                  <el-icon><Grid /></el-icon>
                </el-button>
                <el-button 
                  :type="viewMode === 'list' ? 'primary' : 'default'"
                  @click="viewMode = 'list'"
                  size="small"
                  :aria-pressed="viewMode === 'list'"
                  aria-label="列表视图"
                  title="切换到列表视图"
                >
                  <el-icon><List /></el-icon>
                </el-button>
              </el-button-group>
            </div>

            <!-- 排序选择 -->
            <div class="sort-selector">
              <label for="sort-select" class="sr-only">排序方式</label>
              <el-select 
                v-model="sortBy" 
                placeholder="排序方式" 
                size="small"
                id="sort-select"
                aria-label="选择商品排序方式"
              >
                <el-option label="价格从低到高" value="price-asc" />
                <el-option label="价格从高到低" value="price-desc" />
                <el-option label="销量优先" value="sales" />
                <el-option label="评分优先" value="rating" />
              </el-select>
            </div>
          </div>

          <div class="toolbar-right">
            <!-- 筛选按钮 -->
            <el-button 
              @click="showFilters = !showFilters" 
              size="small"
              :aria-expanded="showFilters"
              :aria-controls="filterPanelId"
              aria-label="筛选商品"
              title="显示或隐藏筛选选项"
            >
              <el-icon><Filter /></el-icon>
              筛选
            </el-button>

            <!-- 商品数量显示 -->
            <span class="product-count" aria-live="polite">
              共 {{ total }} 件商品
            </span>
          </div>
        </div>

        <!-- 筛选面板 -->
        <div 
          v-if="showFilters" 
          class="filter-panel"
          :id="filterPanelId"
          role="region"
          aria-label="商品筛选选项"
        >
          <div class="filter-section">
            <h4 id="category-label">商品类别</h4>
            <el-select
              v-model="selectedCategories"
              multiple
              placeholder="请选择商品类别"
              size="small"
              style="width: 100%;"
              aria-labelledby="category-label"
            >
              <el-option label="Beauty" value="beauty" />
              <el-option label="Fragrances" value="fragrances" />
              <el-option label="Furniture" value="furniture" />
              <el-option label="Groceries" value="groceries" />
              <el-option label="Home Decoration" value="home-decoration" />
              <el-option label="Kitchen Accessories" value="kitchen-accessories" />
              <el-option label="Laptops" value="laptops" />
              <el-option label="Men's Shirts" value="mens-shirts" />
              <el-option label="Men's Shoes" value="mens-shoes" />
              <el-option label="Men's Watches" value="mens-watches" />
              <el-option label="Mobile Accessories" value="mobile-accessories" />
            </el-select>
          </div>
          <div class="filter-section">
            <h4 id="price-range-label">价格范围</h4>
            <el-slider
              v-model="priceRange"
              range
              :min="0"
              :max="10000"
              :step="100"
              show-input
              input-size="small"
              aria-labelledby="price-range-label"
              aria-describedby="price-range-desc"
            />
            <div id="price-range-desc" class="sr-only">
              拖动滑块选择价格范围，当前范围：{{ priceRange[0] }} 到 {{ priceRange[1] }} 元
            </div>
          </div>
          <div class="filter-actions">
            <el-button 
              @click="clearFilters" 
              size="small"
              aria-label="清除所有筛选条件"
            >
              清除筛选
            </el-button>
          </div>
        </div>

        <!-- 商品网格 -->
        <div 
          class="products-container" 
          :class="viewMode"
          role="region"
          :aria-label="`商品列表，${viewMode === 'grid' ? '网格' : '列表'}视图，共 ${products.length} 件商品`"
        >
          <template v-if="products.length > 0">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-item"
            >
              <ProductCard 
                :product="product" 
                :is-list-view="viewMode === 'list'" 
                :keyword="typeof route.query.keyword === 'string' ? route.query.keyword : (Array.isArray(route.query.keyword) ? (typeof route.query.keyword[0] === 'string' ? route.query.keyword[0] : undefined) : undefined)" 
              />
            </div>
          </template>
          <el-empty v-else description="未找到相关商品" />
        </div>

        <!-- 分页 -->
        <div class="pagination-container" role="navigation" aria-label="商品分页">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48, 96]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            aria-label="商品分页导航"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Grid, List, Filter } from '@element-plus/icons-vue';
import { useProductStore } from '../store/product';
import NavBar from '../components/NavBar.vue';
import ProductCard from '../components/ProductCard.vue';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const { products, total } = storeToRefs(productStore);
const route = useRoute();

// 响应式数据
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('price-desc');
const showFilters = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);

// 筛选相关
const priceRange = ref([0, 10000]);
const selectedCategories = ref<string[]>([]);

// 生成唯一ID
const filterPanelId = ref('filter-panel-' + Math.random().toString(36).substr(2, 9));

// --- 核心数据获取逻辑 ---
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const fetchData = (resetPage = false) => {
  if (resetPage) {
    currentPage.value = 1;
  }

  const params: { [key: string]: any } = {
    page: currentPage.value,
    limit: pageSize.value,
    sortBy: sortBy.value,
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
    categories: selectedCategories.value.length > 0 ? selectedCategories.value.join(',') : undefined,
    keyword: route.query.keyword || undefined
  };

  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  productStore.fetchProducts(queryParams);
};

const debouncedFetchData = debounce(() => fetchData(true), 500);

// --- 事件处理 ---
const clearFilters = () => {
  priceRange.value = [0, 10000];
  selectedCategories.value = [];
  // Watcher 会自动触发 debouncedFetchData
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData(true);
};

const handleCurrentChange = () => {
  fetchData(false);
};

// --- 监听器 ---
// 监听筛选条件变化，自动应用
watch(priceRange, debouncedFetchData, { deep: true });
watch(selectedCategories, debouncedFetchData, { deep: true });

// 监听排序变化
watch(sortBy, () => {
  fetchData(true);
});

// 监听路由query变化，自动搜索
watch(() => route.query.keyword, () => {
  fetchData(true);
});

// 在组件挂载后获取商品数据
onMounted(() => {
  fetchData(false);
});
</script>

<style scoped>
.product-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* 页面头部 */
.page-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
  font-size: 1.1rem;
}

/* 主要内容区域 */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  display: flex;
  align-items: center;
}

.sort-selector {
  min-width: 150px;
}

.product-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 筛选面板 */
.filter-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideDown 0.3s ease-out;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  color: white;
  margin: 0 0 12px 0;
  font-size: 1rem;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 商品容器 */
.products-container {
  margin-bottom: 40px;
}

.products-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.products-container.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.products-container.list .product-item {
  width: 100%;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
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
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .products-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .filter-panel {
    padding: 16px;
  }
  
  .filter-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .products-container.grid {
    grid-template-columns: 1fr;
  }
  
  .toolbar-left {
    flex-direction: column;
    gap: 12px;
  }
  
  .sort-selector {
    min-width: 120px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .filter-panel,
  .toolbar {
    background: rgba(0, 0, 0, 0.3);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .filter-panel,
  .toolbar {
    border-width: 2px;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .filter-panel {
    animation: none;
  }
}

/* 焦点样式 */
.toolbar button:focus,
.filter-actions button:focus {
  outline: 2px solid #409eff;
  outline-offset: 2px;
}

/* 高对比度模式下的焦点样式 */
@media (prefers-contrast: high) {
  .toolbar button:focus,
  .filter-actions button:focus {
    outline-width: 3px;
  }
}
</style> 