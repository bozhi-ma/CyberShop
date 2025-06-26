# 电商后端API服务

## 功能特性

- 商品管理API
- 用户管理API
- 订单管理API
- 评论管理API
- 数据库自动初始化

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

创建 `.env` 文件并配置数据库连接：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
```

### 3. 初始化数据库

```bash
npm run init-db
```

这将：
- 创建数据库表结构
- 插入示例商品数据（包含真实图片链接）

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API接口

### 商品相关

- `GET /products` - 获取商品列表（支持分页）
- `GET /products/:id` - 获取商品详情
- `POST /products` - 创建新商品
- `PUT /products/:id` - 更新商品信息
- `DELETE /products/:id` - 删除商品

### 用户相关

- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录

### 订单相关

- `POST /orders` - 创建订单
- `GET /orders` - 获取订单列表
- `GET /orders/:id` - 获取订单详情

## 商品数据

系统预置了12个商品，包含：
- iPhone 15 Pro
- MacBook Air M2
- AirPods Pro
- iPad Pro 12.9
- Samsung Galaxy S24
- Dell XPS 13
- Sony WH-1000XM5
- Nintendo Switch OLED
- Canon EOS R6
- DJI Mini 3 Pro
- Apple Watch Series 9
- Samsung Galaxy Tab S9

所有商品都使用Unsplash的真实图片链接，确保图片正常显示。

## 技术栈

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- CORS 