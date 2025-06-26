<template>
  <div class="analysis">
    <NavBar />
    <h1>数据分析</h1>
    
    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon sales">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-info">
            <h3>总销售额</h3>
            <p class="amount">¥{{ formatNumber(totalSales) }}</p>
            <span class="trend up">+12.5%</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon orders">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="card-info">
            <h3>订单数量</h3>
            <p class="amount">{{ formatNumber(totalOrders) }}</p>
            <span class="trend up">+8.3%</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon users">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-info">
            <h3>活跃用户</h3>
            <p class="amount">{{ formatNumber(activeUsers) }}</p>
            <span class="trend up">+15.2%</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon products">
            <el-icon><Goods /></el-icon>
          </div>
          <div class="card-info">
            <h3>商品数量</h3>
            <p class="amount">{{ formatNumber(totalProducts) }}</p>
            <span class="trend up">+5.7%</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 销售趋势图 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>销售趋势分析</span>
            <el-select v-model="salesTimeRange" size="small">
              <el-option label="最近7天" value="7" />
              <el-option label="最近30天" value="30" />
              <el-option label="最近90天" value="90" />
            </el-select>
          </div>
        </template>
        <v-chart class="chart" :option="salesChartOption" />
      </el-card>

      <!-- 商品分类占比 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>商品分类销售占比</span>
          </div>
        </template>
        <v-chart class="chart" :option="categoryChartOption" />
      </el-card>

      <!-- 热门商品排行 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>热门商品排行</span>
          </div>
        </template>
        <v-chart class="chart" :option="hotProductsChartOption" />
      </el-card>

      <!-- 用户行为分析 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>用户行为分析</span>
          </div>
        </template>
        <v-chart class="chart" :option="userBehaviorChartOption" />
      </el-card>

      <!-- 地区销售分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>地区销售分布</span>
          </div>
        </template>
        <v-chart class="chart" :option="regionChartOption" />
      </el-card>

      <!-- 实时数据监控 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>实时数据监控</span>
            <el-tag type="success" size="small">实时</el-tag>
          </div>
        </template>
        <div class="realtime-data">
          <div class="realtime-item">
            <span class="label">当前在线用户</span>
            <span class="value">{{ onlineUsers }}</span>
          </div>
          <div class="realtime-item">
            <span class="label">今日新增订单</span>
            <span class="value">{{ todayOrders }}</span>
          </div>
          <div class="realtime-item">
            <span class="label">今日销售额</span>
            <span class="value">¥{{ formatNumber(todaySales) }}</span>
          </div>
          <div class="realtime-item">
            <span class="label">平均订单金额</span>
            <span class="value">¥{{ formatNumber(avgOrderAmount) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>详细数据报表</span>
          <el-button type="primary" size="small" @click="exportData">导出数据</el-button>
        </div>
      </template>
      <el-table :data="tableData" border>
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="sales" label="销售额" />
        <el-table-column prop="orders" label="订单数" />
        <el-table-column prop="users" label="用户数" />
        <el-table-column prop="conversion" label="转化率" />
        <el-table-column prop="avgAmount" label="平均订单金额" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { 
  TrendCharts, 
  ShoppingCart, 
  User, 
  Goods 
} from '@element-plus/icons-vue';
import { useNotificationStore } from '../store/notification';
import NavBar from '../components/NavBar.vue';

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;

// 数据概览
const totalSales = ref(1256800);
const totalOrders = ref(8560);
const activeUsers = ref(12450);
const totalProducts = ref(2340);

// 实时数据
const onlineUsers = ref(1234);
const todayOrders = ref(156);
const todaySales = ref(45600);
const avgOrderAmount = ref(292);

// 时间范围选择
const salesTimeRange = ref('30');

// 销售趋势图配置
const salesChartOption = computed(() => ({
  title: {
    text: '销售趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['销售额', '订单数'],
    top: 30
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: [
    {
      type: 'value',
      name: '销售额(万元)',
      position: 'left'
    },
    {
      type: 'value',
      name: '订单数',
      position: 'right'
    }
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '订单数',
      type: 'bar',
      yAxisIndex: 1,
      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149],
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
}));

// 商品分类占比图配置
const categoryChartOption = computed(() => ({
  title: {
    text: '商品分类销售占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '销售占比',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '手机数码' },
        { value: 735, name: '电脑办公' },
        { value: 580, name: '家用电器' },
        { value: 484, name: '服装配饰' },
        { value: 300, name: '其他' }
      ]
    }
  ]
}));

// 热门商品排行图配置
const hotProductsChartOption = computed(() => ({
  title: {
    text: '热门商品销量排行',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: ['iPhone 15 Pro', 'MacBook Pro', 'AirPods Pro', 'iPad Air', 'Apple Watch']
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [320, 302, 301, 334, 390],
      itemStyle: {
        color: function(params: any) {
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
          return colors[params.dataIndex];
        }
      }
    }
  ]
}));

// 用户行为分析图配置
const userBehaviorChartOption = computed(() => ({
  title: {
    text: '用户行为分析',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    data: ['浏览商品', '加入购物车', '收藏商品', '完成购买'],
    top: 30
  },
  radar: {
    indicator: [
      { name: '浏览商品', max: 100 },
      { name: '加入购物车', max: 100 },
      { name: '收藏商品', max: 100 },
      { name: '完成购买', max: 100 },
      { name: '分享商品', max: 100 },
      { name: '评价商品', max: 100 }
    ]
  },
  series: [
    {
      name: '用户行为',
      type: 'radar',
      data: [
        {
          value: [85, 65, 45, 35, 25, 20],
          name: '行为数据'
        }
      ]
    }
  ]
}));

// 地区销售分布图配置
const regionChartOption = computed(() => ({
  title: {
    text: '地区销售分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '销售分布',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '北京' },
        { value: 735, name: '上海' },
        { value: 580, name: '广州' },
        { value: 484, name: '深圳' },
        { value: 300, name: '杭州' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

// 表格数据
const tableData = ref([
  { date: '2024-01-01', sales: '¥125,680', orders: '856', users: '1245', conversion: '68.7%', avgAmount: '¥146.8' },
  { date: '2024-01-02', sales: '¥132,450', orders: '892', users: '1356', conversion: '65.8%', avgAmount: '¥148.5' },
  { date: '2024-01-03', sales: '¥118,920', orders: '823', users: '1189', conversion: '69.2%', avgAmount: '¥144.5' },
  { date: '2024-01-04', sales: '¥145,230', orders: '967', users: '1423', conversion: '67.9%', avgAmount: '¥150.2' },
  { date: '2024-01-05', sales: '¥156,780', orders: '1023', users: '1567', conversion: '65.3%', avgAmount: '¥153.3' }
]);

// 格式化数字
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 导出数据
const exportData = () => {
  const data = {
    exportTime: new Date().toLocaleString(),
    overview: {
      totalSales,
      totalOrders,
      activeUsers,
      totalProducts
    },
    tableData: tableData.value
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `数据分析报告_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  addNotification({ message: '数据报告已导出', type: 'success' });
};

// 实时数据更新
let timer: any;
onMounted(() => {
  timer = setInterval(() => {
    onlineUsers.value = Math.floor(Math.random() * 500) + 1000;
    todayOrders.value += Math.floor(Math.random() * 5);
    todaySales.value += Math.floor(Math.random() * 1000);
    avgOrderAmount.value = Math.floor(todaySales.value / todayOrders.value);
  }, 5000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.analysis {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.overview-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon.sales { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.card-icon.orders { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.card-icon.users { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.card-icon.products { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.card-info h3 {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.amount {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.trend {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.trend.up {
  background: #f0f9ff;
  color: #67c23a;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 400px;
  width: 100%;
}

.realtime-data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.realtime-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.realtime-item .label {
  color: #606266;
  font-size: 14px;
}

.realtime-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .realtime-data {
    grid-template-columns: 1fr;
  }
}
</style> 