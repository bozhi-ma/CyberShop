const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product } = require('../models');

// 创建订单
router.post('/', async (req, res) => {
  const { user_id, items, total_price } = req.body;
  try {
    const order = await Order.create({ user_id, total_price, status: 'pending' });
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    res.json({ message: '订单创建成功', order_id: order.id });
  } catch (err) {
    res.status(500).json({ message: '订单创建失败', error: err.message });
  }
});

// 获取订单列表
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: '获取订单列表失败', error: err.message });
  }
});

// 获取订单详情
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });
    if (!order) return res.status(404).json({ message: '订单不存在' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: '获取订单详情失败', error: err.message });
  }
});

module.exports = router; 