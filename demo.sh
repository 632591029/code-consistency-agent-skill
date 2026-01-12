#!/bin/bash

# ALPHA Signal Hub 演示脚本

echo "========================================="
echo "  ALPHA Signal Hub 功能演示"
echo "========================================="
echo ""

# 设置环境变量
export USE_MOCK_DATA=true
export GEMINI_API_KEY=your_gemini_api_key_here
export OPENAI_API_KEY=your_openai_api_key_here
export RESEND_API_KEY=your_resend_api_key_here
export FROM_EMAIL=alpha@signal.ai
export CRON_SECRET=alpha_secure_trigger_2025
export USER_EMAIL=a632591029@gmail.com
export PORT=3000

echo "1. 测试模拟数据生成..."
node test-mock.js
echo ""

echo "2. 启动后端服务（模拟数据模式）..."
node server.js > demo-backend.log 2>&1 &
BACKEND_PID=$!
echo "   后端服务 PID: $BACKEND_PID"
sleep 3

echo ""
echo "3. 测试健康检查接口..."
curl -s http://localhost:3000/health | python3 -m json.tool
echo ""

echo "4. 测试信号扫描接口..."
curl -s -X POST "http://localhost:3000/api/cron/scan" \
  -H "Authorization: Bearer alpha_secure_trigger_2025" \
  -H "Content-Type: application/json" \
  -d '{"preferences": "AI Productivity, Web3"}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print('Status:', data.get('status')); print('Engine:', data.get('engine')); print('Count:', data.get('count')); signals=data.get('signals', []); print('\n前3条信号:'); [print(f\"{i+1}. {s.get('title', 'N/A')}\") for i, s in enumerate(signals[:3])]"

echo ""
echo ""
echo "5. 保存信号数据到文件..."
curl -s -X POST "http://localhost:3000/api/cron/scan" \
  -H "Authorization: Bearer alpha_secure_trigger_2025" \
  -H "Content-Type: application/json" \
  -d '{"preferences": "AI Productivity, Web3"}' \
  > demo-signals.json
echo "   已保存到 demo-signals.json"

echo ""
echo "========================================="
echo "  演示完成！"
echo "========================================="
echo ""
echo "后端服务访问地址："
echo "  - 本地: http://localhost:3000"
echo "  - 公网: https://3000-i4okhgnlnffhyuaexzokn-3fab9ab5.us2.manus.computer"
echo ""
echo "前端服务访问地址："
echo "  - 本地: http://localhost:3002"
echo "  - 公网: https://3002-i4okhgnlnffhyuaexzokn-3fab9ab5.us2.manus.computer"
echo ""
echo "停止后端服务: kill $BACKEND_PID"
echo ""
