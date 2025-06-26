const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { Op } = require('sequelize');

// 获取商品列表（支持分页、筛选和排序）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const { sortBy, minPrice, maxPrice, categories } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {};
    if (minPrice && maxPrice) {
      where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    }
    if (categories) {
      where.category = { [Op.in]: categories.split(',') };
    }

    // 打印实际 where 条件，便于调试
    console.log('商品列表 where 查询条件:', where);

    // 构建排序条件
    let order = [['created_at', 'DESC']]; // 默认排序
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          order = [['price', 'ASC']];
          break;
        case 'price-desc':
          order = [['price', 'DESC']];
          break;
        case 'sales':
          order = [['sales', 'DESC']];
          break;
        case 'rating':
          order = [['rating', 'DESC']];
          break;
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });

    res.json({ total: count, list: rows });
  } catch (err) {
    console.error('获取商品列表失败:', err);
    res.status(500).json({ message: '获取商品列表失败', error: err.message });
  }
});

// 获取商品详情
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: '商品不存在' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: '获取商品详情失败', error: err.message });
  }
});

// 新增商品
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ message: '商品创建成功', product });
  } catch (err) {
    res.status(500).json({ message: '商品创建失败', error: err.message });
  }
});

// 修改商品
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: '商品不存在' });
    await product.update(req.body);
    res.json({ message: '商品修改成功', product });
  } catch (err) {
    res.status(500).json({ message: '商品修改失败', error: err.message });
  }
});

// 删除商品
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: '商品不存在' });
    await product.destroy();
    res.json({ message: '商品删除成功' });
  } catch (err) {
    res.status(500).json({ message: '商品删除失败', error: err.message });
  }
});

module.exports = router; 