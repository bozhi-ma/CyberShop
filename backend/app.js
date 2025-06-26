const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const commentRouter = require('./routes/comment');

const app = express();
app.use(cors());
app.use(express.json());

// 测试数据库连接并同步模型
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
    return sequelize.sync();
  })
  .then(() => {
    console.log('所有模型已同步');
  })
  .catch((err) => {
    console.error('数据库连接失败:', err);
  });

app.get('/', (req, res) => {
  res.send('电商商品展示系统后端API');
});

app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/comments', commentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，端口：${PORT}`);
}); 