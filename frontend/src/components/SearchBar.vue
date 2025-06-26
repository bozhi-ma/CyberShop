/**
 * 搜索栏组件
 * 支持商品搜索、搜索建议、历史记录、热门搜索等
 */

<template>
  <div class="search-bar">
    <el-input
      v-model="searchKeyword"
      placeholder="搜索商品..."
      @input="onSearchInput"
      @keyup.enter="onSearch"
      clearable
    >
      <template #append>
        <el-button @click="onSearch">搜索</el-button>
      </template>
    </el-input>
    
    <!-- 搜索建议 -->
    <div v-if="showSuggestions && searchSuggestions.length" class="suggestions">
      <div
        v-for="suggestion in searchSuggestions"
        :key="suggestion"
        class="suggestion-item"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>

    <!-- 搜索历史和热门搜索 -->
    <div v-if="showHistory" class="search-panel">
      <div v-if="searchHistory.length" class="history-section">
        <h4>搜索历史</h4>
        <div class="history-list">
          <el-tag
            v-for="keyword in searchHistory"
            :key="keyword"
            @click="selectHistory(keyword)"
            closable
            @close="removeSearchHistory(keyword)"
          >
            {{ keyword }}
          </el-tag>
        </div>
        <el-button size="small" @click="clearSearchHistory">清空历史</el-button>
      </div>
      
      <div class="hot-section">
        <h4>热门搜索</h4>
        <div class="hot-list">
          <el-tag
            v-for="keyword in hotSearches"
            :key="keyword"
            @click="selectHistory(keyword)"
            type="info"
          >
            {{ keyword }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../store/search'

// Pinia搜索store实例
const searchStore = useSearchStore()
const { 
  searchHistory, 
  searchSuggestions, 
  hotSearches,
  addSearchHistory, 
  removeSearchHistory, 
  clearSearchHistory,
  setSearchSuggestions
} = searchStore

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')
// 是否显示建议
const showSuggestions = ref(false)
// 是否显示历史/热门
const showHistory = ref(false)

/**
 * 输入时触发，动态显示建议或历史
 */
const onSearchInput = () => {
  if (searchKeyword.value) {
    showSuggestions.value = true
    showHistory.value = false
    // 模拟搜索建议
    const suggestions = ['手机', '手机壳', '手机充电器'].filter(item => 
      item.includes(searchKeyword.value)
    )
    setSearchSuggestions(suggestions)
  } else {
    showSuggestions.value = false
    showHistory.value = true
  }
}

/**
 * 执行搜索，添加历史，并跳转到商品列表页
 */
const onSearch = async () => {
  if (searchKeyword.value.trim()) {
    addSearchHistory(searchKeyword.value.trim())
    // 真实搜索：跳转到商品列表页并带上关键词参数
    router.push({
      path: '/products',
      query: { keyword: searchKeyword.value.trim() }
    })
    // 如果需要在本地显示结果，可以调用：
    // const result = await searchProducts(searchKeyword.value.trim())
    // console.log('搜索结果:', result)
  }
}

/**
 * 选择建议词，填充并添加历史
 */
const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  addSearchHistory(suggestion)
  showSuggestions.value = false
  onSearch()
}

/**
 * 选择历史/热门词，填充并添加历史
 */
const selectHistory = (keyword: string) => {
  searchKeyword.value = keyword
  addSearchHistory(keyword)
  showHistory.value = false
  onSearch()
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdfe6;
  border-top: none;
  z-index: 1000;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

.search-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdfe6;
  border-top: none;
  padding: 16px;
  z-index: 1000;
}

.history-section {
  margin-bottom: 16px;
}

.history-list {
  margin: 8px 0;
}

.history-list .el-tag {
  margin: 4px;
  cursor: pointer;
}

.hot-section h4 {
  margin-bottom: 8px;
}

.hot-list .el-tag {
  margin: 4px;
  cursor: pointer;
}
</style> 