const sequelize = require('../config/database');

const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Order = require('./order')(sequelize);
const OrderItem = require('./order_item')(sequelize);
const Comment = require('./comment')(sequelize);

// 关联关系
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Comment,
}; 