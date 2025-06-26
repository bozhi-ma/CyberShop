<template>
  <div class="cart-page">
    <el-card class="cart-card">
      <div class="header">
        <h2>购物车</h2>
        <div class="header-buttons">
          <el-button @click="$router.push('/user')" type="primary" round>返回用户中心</el-button>
          <el-button @click="$router.push('/')" type="primary" round>返回首页</el-button>
        </div>
      </div>
      <el-table :data="cartItems" v-loading="loading" style="width: 100%" empty-text="购物车为空">
        <el-table-column type="selection" width="50" />
        <el-table-column label="商品" min-width="220">
          <template #default="scope">
            <div class="cart-item-info">
              <el-image :src="scope.row.image" fit="cover" class="cart-item-img" />
              <span class="cart-item-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template #default="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template #default="scope">
            <el-input-number v-model="scope.row.count" :min="1" @change="updateCount(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="scope">¥{{ (scope.row.price * scope.row.count).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cart-footer">
        <el-checkbox v-model="allSelected" @change="toggleAll">全选</el-checkbox>
        <span class="cart-total">合计：<b>¥{{ totalPrice }}</b></span>
        <el-button type="danger" @click="clearCart" :disabled="cartItems.length === 0">清空购物车</el-button>
        <el-button type="primary" @click="checkout" :disabled="selectedItems.length === 0">结算</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '../store/cart';
import { ElMessageBox, ElMessage } from 'element-plus';

const cartStore = useCartStore();
const loading = ref(false);
const cartItems = computed(() => cartStore.items);
const selected = ref<any[]>([]);

const allSelected = computed({
  get: () => selected.value.length === cartItems.value.length && cartItems.value.length > 0,
  set: val => toggleAll(val)
});

const selectedItems = computed(() => selected.value);
const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2));

function updateCount(item: any) {
  cartStore.updateItemCount(item.id, item.count);
}
function removeItem(item: any) {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', { type: 'warning' })
    .then(() => {
      cartStore.removeFromCart(item.id);
      ElMessage.success('已删除');
      selected.value = selected.value.filter(i => i.id !== item.id);
    });
}
function clearCart() {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', { type: 'warning' })
    .then(() => {
      cartStore.clearCart();
      ElMessage.success('购物车已清空');
      selected.value = [];
    });
}
function toggleAll(val: boolean) {
  if (val) {
    selected.value = [...cartItems.value];
  } else {
    selected.value = [];
  }
}
function checkout() {
  ElMessage.success('结算功能待开发');
}
onMounted(() => {
  selected.value = [...cartItems.value];
});
</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 40px auto;
}
.cart-card {
  padding: 24px;
}
.header {
  margin-bottom: 16px;
  text-align: center;
  position: relative;
}
.header-buttons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 12px;
}
.cart-item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cart-item-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: #444;
}
.cart-item-name {
  font-weight: 500;
  color: #fff;
}
.cart-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
  justify-content: flex-end;
}
.cart-total {
  font-size: 1.1rem;
  color: #00fff7;
  margin-right: 24px;
}
</style> 