// 订单相关API接口

// 获取订单列表
export async function getOrderList(_params: any) {
  // mock: 实际应为 request.get('/orders', { params })
  return Promise.resolve({
    list: [
      { id: 1, orderNo: '20240625001', status: '待付款', total: 599, createdAt: '2024-06-25 10:00', items: [
        { name: '商品A', count: 1 },
        { name: '商品B', count: 2 }
      ] },
      { id: 2, orderNo: '20240625002', status: '已发货', total: 499, createdAt: '2024-06-24 09:00', items: [
        { name: '商品C', count: 1 },
        { name: '商品D', count: 1 }
      ] }
    ],
    total: 2
  });
}

// 获取订单详情
export async function getOrderDetail(id: number) {
  // mock: 实际应为 request.get(`/orders/${id}`)
  return Promise.resolve({
    id,
    orderNo: '20240625001',
    status: '待付款',
    total: 599,
    createdAt: '2024-06-25 10:00',
    items: [
      { name: '商品A', count: 1, price: 299 },
      { name: '商品B', count: 2, price: 150 }
    ],
    address: '北京市朝阳区xxx',
    user: { name: 'mbz', phone: '138****8888' }
  });
}

// 取消订单
export async function cancelOrder(_id: number) {
  // mock: 实际应为 request.post(`/orders/${id}/cancel`)
  return Promise.resolve({ success: true });
}

// 再次购买
export async function reorder(_id: number) {
  // mock: 实际应为 request.post(`/orders/${id}/reorder`)
  return Promise.resolve({ success: true });
} 