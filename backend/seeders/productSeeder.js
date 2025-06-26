const { Product } = require('../models');
const fs = require('fs');
const path = require('path');

// 读取 dummy_products.json
const dummyPath = path.join(__dirname, '../dummy_products.json');
const dummyData = JSON.parse(fs.readFileSync(dummyPath, 'utf-8'));

// 字段映射与适配 - 保持原始英文类别
const products = dummyData.products.map((item) => {
  return {
    name: item.title,
    description: item.description,
    price: item.price,
    image: (item.images && item.images.length > 0) ? item.images[0] : item.thumbnail,
    stock: item.stock,
    rating: item.rating,
    brand: item.brand || '',
    category: item.category, // 保持原始英文类别
    sales: Math.floor(Math.random() * 2000),
    reviews: Array.isArray(item.reviews) ? item.reviews.length : 0,
    isNew: Math.random() > 0.5,
    isHot: Math.random() > 0.5
  };
});

async function seedProducts() {
  try {
    await Product.destroy({ where: {} });
    for (const product of products) {
      await Product.create(product);
    }
    console.log('商品数据初始化完成！（保持原始英文类别）');
  } catch (error) {
    console.error('商品数据初始化失败:', error);
  }
}

module.exports = { seedProducts };