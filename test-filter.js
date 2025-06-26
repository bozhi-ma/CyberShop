const axios = require('axios');

async function testFilter() {
  try {
    console.log('测试筛选功能...');
    
    // 测试获取所有商品
    const allProducts = await axios.get('http://localhost:3000/api/products');
    console.log(`总商品数量: ${allProducts.data.total}`);
    
    // 测试按类别筛选
    const beautyProducts = await axios.get('http://localhost:3000/api/products?categories=beauty');
    console.log(`Beauty类别商品数量: ${beautyProducts.data.total}`);
    
    const furnitureProducts = await axios.get('http://localhost:3000/api/products?categories=furniture');
    console.log(`Furniture类别商品数量: ${furnitureProducts.data.total}`);
    
    const laptopsProducts = await axios.get('http://localhost:3000/api/products?categories=laptops');
    console.log(`Laptops类别商品数量: ${laptopsProducts.data.total}`);
    
    // 测试多类别筛选
    const multiCategory = await axios.get('http://localhost:3000/api/products?categories=beauty,furniture');
    console.log(`Beauty + Furniture类别商品数量: ${multiCategory.data.total}`);
    
    console.log('筛选功能测试完成！');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testFilter(); 