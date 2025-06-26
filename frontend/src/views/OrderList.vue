<template>
  <div class="order-list-page">
    <el-card class="order-list-card">
      <div class="header">
        <h2>订单管理</h2>
      </div>
      <el-table :data="orders" v-loading="loading" style="width: 100%" empty-text="暂无订单">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="total" label="总金额" width="100" />
        <el-table-column prop="createdAt" label="下单时间" width="180" />
        <el-table-column label="商品名称" min-width="180">
          <template #default="scope">
            {{ (scope.row.items as any[]).map((i: any) => i.name).join('，') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" @click="showDetail(scope.row)">详情</el-button>
            <el-button size="small" type="danger" v-if="scope.row.status === '待付款'" @click="cancel(scope.row)">取消</el-button>
            <el-button size="small" type="primary" @click="reorder(scope.row)">再次购买</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="fetchPage"
        class="pagination"
      />
    </el-card>
    <el-dialog v-model="detailVisible" title="订单详情" width="500px" :close-on-click-modal="false">
      <div v-if="orderDetail">
        <p>订单号：{{ orderDetail.orderNo }}</p>
        <p>状态：{{ orderDetail.status }}</p>
        <p>下单时间：{{ orderDetail.createdAt }}</p>
        <p>收货地址：{{ orderDetail.address }}</p>
        <p>收货人：{{ orderDetail.user.name }}（{{ orderDetail.user.phone }}）</p>
        <el-table :data="orderDetail.items" style="width: 100%; margin-top: 10px;">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="count" label="数量" width="80" />
          <el-table-column prop="price" label="单价" width="100" />
        </el-table>
        <div style="margin-top: 10px; text-align: right;">
          <b>总金额：¥{{ orderDetail.total }}</b>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '../store/order';
import { ElMessageBox, ElMessage } from 'element-plus';

const orderStore = useOrderStore();
const { orders, total, loading, orderDetail, fetchOrders, fetchOrderDetail, doCancelOrder, doReorder } = orderStore;

const currentPage = ref(1);
const pageSize = 10;
const detailVisible = ref(false);

function fetchPage(page: number) {
  fetchOrders({ page, limit: pageSize });
}

function showDetail(row: any) {
  fetchOrderDetail(row.id);
  detailVisible.value = true;
}

function cancel(row: any) {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', { type: 'warning' })
    .then(async () => {
      await doCancelOrder(row.id);
      ElMessage.success('订单已取消');
      fetchPage(currentPage.value);
    });
}

function reorder(row: any) {
  doReorder(row.id).then(() => {
    ElMessage.success('已加入购物车');
  });
}

onMounted(() => {
  fetchPage(currentPage.value);
});
</script>

<style scoped>
.order-list-page {
  max-width: 800px;
  margin: 40px auto;
}
.order-list-card {
  padding: 24px;
}
.header {
  margin-bottom: 16px;
  text-align: center;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style> 