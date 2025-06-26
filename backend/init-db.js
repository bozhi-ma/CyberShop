const { sequelize } = require('./models');
const { seedProducts } = require('./seeders/productSeeder');

async function initDatabase() {
  await sequelize.sync({ force: true }); // 自动建表
  await seedProducts(); // 插入100件商品
  console.log('数据库结构同步完成');
}

initDatabase();

module.exports = { initDatabase }; 