#!/bin/bash

# ALPHA 定时任务脚本
# 用于每天 9:00 和 20:00 执行信号扫描和邮件推送

# 加载环境变量
source /home/ubuntu/lifeStart/.env.local

BACKEND_URL="http://localhost:3000"
CRON_SECRET="${CRON_SECRET:-alpha_secure_trigger_2025}"
USER_EMAIL="${USER_EMAIL:-a632591029@gmail.com}"
SCAN_PREFERENCES="${SCAN_PREFERENCES:-AI Productivity, Web3 Infrastructure, GPU Markets, Open Source}"

echo "[$(date)] 🚀 开始执行 ALPHA 定时任务..."

# 1. 执行信号扫描
echo "[$(date)] 📡 正在扫描全网信号..."
SCAN_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/cron/scan" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{\"preferences\": \"${SCAN_PREFERENCES}\"}")

echo "[$(date)] 扫描结果: ${SCAN_RESPONSE}"

# 检查扫描是否成功
if echo "${SCAN_RESPONSE}" | grep -q '"status":"success"'; then
  echo "[$(date)] ✅ 信号扫描成功"
  
  # 提取信号数据
  SIGNALS=$(echo "${SCAN_RESPONSE}" | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('signals', [])))")
  SIGNAL_COUNT=$(echo "${SIGNALS}" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))")
  
  echo "[$(date)] 📊 检测到 ${SIGNAL_COUNT} 条信号"
  
  # 2. 发送邮件简报
  if [ "${SIGNAL_COUNT}" -gt 0 ]; then
    echo "[$(date)] 📧 正在发送邮件简报到 ${USER_EMAIL}..."
    EMAIL_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/email/send" \
      -H "Authorization: Bearer ${CRON_SECRET}" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"${USER_EMAIL}\", \"signals\": ${SIGNALS}}")
    
    echo "[$(date)] 邮件发送结果: ${EMAIL_RESPONSE}"
    
    if echo "${EMAIL_RESPONSE}" | grep -q '"success":true'; then
      echo "[$(date)] ✅ 邮件发送成功"
    else
      echo "[$(date)] ❌ 邮件发送失败"
    fi
  else
    echo "[$(date)] ⚠️  没有信号数据，跳过邮件发送"
  fi
else
  echo "[$(date)] ❌ 信号扫描失败"
fi

echo "[$(date)] 🏁 定时任务执行完成"
echo "----------------------------------------"
