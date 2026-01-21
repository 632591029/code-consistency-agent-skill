#!/bin/bash

# 自动提交脚本
# 用于更新项目活动日志并推送到 GitHub

# 设置项目目录
PROJECT_DIR="/home/ubuntu/code-consistency-agent-skill"
cd "${PROJECT_DIR}" || exit 1

# 获取当前时间
CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_TIME=$(date +"%H:%M:%S")
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "[${TIMESTAMP}] 🚀 开始执行自动提交任务..."

# 配置 Git 用户信息（如果尚未配置）
git config user.email "a632591029@gmail.com" 2>/dev/null || true
git config user.name "AI Agent" 2>/dev/null || true

# 更新 ACTIVITY_LOG.md
echo "[${TIMESTAMP}] 📝 更新活动日志..."
cat > ACTIVITY_LOG.md << EOF

## 活动记录 - ${TIMESTAMP}

- **日期**: ${CURRENT_DATE}
- **时间**: ${CURRENT_TIME}
- **活动**: 自动更新项目活动日志
- **状态**: ✅ 成功

# 项目活动日志

本文件记录项目的自动化活动和更新。

---

EOF

# 检查是否有变更
if git diff --quiet ACTIVITY_LOG.md; then
  echo "[${TIMESTAMP}] ℹ️  活动日志无变更，添加时间戳以创建提交..."
  echo "<!-- Updated: ${TIMESTAMP} -->" >> ACTIVITY_LOG.md
fi

# 添加文件到暂存区
echo "[${TIMESTAMP}] 📦 添加文件到暂存区..."
git add ACTIVITY_LOG.md

# 检查是否有需要提交的内容
if git diff --cached --quiet; then
  echo "[${TIMESTAMP}] ℹ️  没有需要提交的更改"
  exit 0
fi

# 提交更改
echo "[${TIMESTAMP}] 💾 提交更改..."
COMMIT_MESSAGE="chore: 自动更新活动日志 - ${TIMESTAMP}"
git commit -m "${COMMIT_MESSAGE}"

if [ $? -ne 0 ]; then
  echo "[${TIMESTAMP}] ❌ 提交失败"
  exit 1
fi

echo "[${TIMESTAMP}] ✅ 提交成功"

# 推送到 GitHub
echo "[${TIMESTAMP}] 🚀 推送到 GitHub..."
git push origin main

if [ $? -ne 0 ]; then
  echo "[${TIMESTAMP}] ❌ 推送失败，尝试推送到 master 分支..."
  git push origin master
  
  if [ $? -ne 0 ]; then
    echo "[${TIMESTAMP}] ❌ 推送失败"
    exit 1
  fi
fi

echo "[${TIMESTAMP}] ✅ 推送成功"
echo "[${TIMESTAMP}] 🏁 自动提交任务执行完成"
echo "----------------------------------------"
