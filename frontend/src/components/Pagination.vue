/*
 * 分页组件
 * 用于分页展示数据，支持页码切换、事件回调等
 */

<template>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :page-size="10"
      :current-page="1"
    />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.pagination {
  margin: 24px 0;
  text-align: center;
}
</style> 