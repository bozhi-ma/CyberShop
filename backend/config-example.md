# 环境配置说明

## 1. 创建环境配置文件

在 `backend` 目录下创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce

# 服务器配置
PORT=3000

# JWT密钥（生产环境请使用强密钥）
JWT_SECRET=your_jwt_secret_key

# 跨域配置
CORS_ORIGIN=http://localhost:5173
```

## 2. 数据库配置说明

- `DB_HOST`: 数据库主机地址，本地开发通常是 `localhost`
- `DB_USER`: 数据库用户名，通常是 `root`
- `DB_PASSWORD`: 数据库密码，请替换为你的实际密码
- `DB_NAME`: 数据库名称，建议使用 `ecommerce`

## 3. 安全配置

- `JWT_SECRET`: JWT令牌签名密钥，生产环境请使用强密钥
- `CORS_ORIGIN`: 允许跨域的前端地址

## 4. 端口配置

- `PORT`: 后端服务端口，默认3000

## 注意事项

1. 请确保MySQL服务已启动
2. 请确保数据库已创建
3. 生产环境请修改所有默认密码和密钥
4. `.env` 文件不要提交到版本控制系统 