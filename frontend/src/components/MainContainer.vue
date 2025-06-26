<template>
  <div class="main-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 32px auto 0 auto;
  min-height: 600px;
  background: #181a2a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 32px 24px;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .main-container {
    max-width: 100%;
    padding: 16px 4px;
    border-radius: 8px;
  }
}
</style> 