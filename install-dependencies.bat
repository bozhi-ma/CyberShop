@echo off
echo ========================================
echo 安装项目依赖
echo ========================================
echo.

echo 正在安装后端依赖...
cd backend
npm install
cd ..

echo.
echo 正在安装前端依赖...
cd frontend
npm install
cd ..

echo.
echo ========================================
echo 依赖安装完成！
echo ========================================
echo.
echo 接下来可以：
echo 1. 配置数据库连接（backend/.env文件）
echo 2. 初始化数据库：cd backend && npm run init-db
echo 3. 启动项目：运行 start-project.bat
echo.
pause 