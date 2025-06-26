@echo off
echo ========================================
echo 电商项目启动脚本
echo ========================================
echo.

echo 正在启动后端服务...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo 等待后端服务启动...
timeout /t 3 /nobreak > nul

echo 正在启动前端服务...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo 项目启动完成！
echo ========================================
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:5173
echo.
echo 请确保已安装依赖并配置数据库
echo 如需初始化数据库，请运行: cd backend && npm run init-db
echo.
pause 