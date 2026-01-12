#!/bin/bash

# ALPHA Signal Hub 启动脚本

# 加载环境变量
export $(cat .env.local | grep -v '^#' | xargs)

echo "🚀 Starting ALPHA Signal Hub..."
echo "📡 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo ""

# 启动后端服务（端口 3001）
PORT=3001 node server.js &
BACKEND_PID=$!

# 等待后端启动
sleep 2

# 启动前端开发服务器（端口 3000）
pnpm run dev &
FRONTEND_PID=$!

echo "✅ Services started!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# 捕获退出信号，清理进程
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# 等待进程
wait
