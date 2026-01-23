#!/bin/bash

# 自动提交脚本 - 用于维护项目活动日志并推送到 GitHub
# 用途: 定期更新 ACTIVITY_LOG.md 并提交,保持项目活跃度
# 特性: 工作日提交策略、智能错误处理、详细日志输出

set -e

# 设置项目目录(支持通用路径)
PROJECT_DIR="/home/ubuntu/code-consistency-agent-skill"
cd "${PROJECT_DIR}" || {
  echo "❌ 无法进入项目目录: ${PROJECT_DIR}"
  exit 1
}

# 配置 Git 用户信息(如果未配置)
git config user.email "a632591029@gmail.com" 2>/dev/null || true
git config user.name "AutoCommitBot" 2>/dev/null || true

# 获取当前时间
CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_TIME=$(date +"%H:%M:%S")
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "=========================================="
echo "🤖 自动提交任务开始"
echo "📅 日期: ${CURRENT_DATE}"
echo "⏰ 时间: ${CURRENT_TIME}"
echo "📂 项目: code-consistency-agent-skill"
echo "=========================================="

# 检查是否是周末(周六=6, 周日=7)
DAY_OF_WEEK=$(date +%u)
if [ "${DAY_OF_WEEK}" -eq 6 ] || [ "${DAY_OF_WEEK}" -eq 7 ]; then
  echo "⚠️  今天是周末,跳过提交任务"
  echo "💡 提示: 脚本配置为仅在工作日(周一至周五)执行提交"
  exit 0
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main --rebase 2>/dev/null || \
git pull origin master --rebase 2>/dev/null || {
  echo "⚠️  拉取代码失败或无远程更新,继续执行..."
}

# 更新 ACTIVITY_LOG.md
echo "📝 更新活动日志..."
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
  echo "ℹ️  没有检测到变更,尝试添加时间戳..."
  echo "<!-- Updated at ${TIMESTAMP} -->" >> ACTIVITY_LOG.md
fi

# 添加文件到暂存区
echo "➕ 添加文件到暂存区..."
git add ACTIVITY_LOG.md

# 检查是否有需要提交的内容
if git diff --cached --quiet; then
  echo "ℹ️  没有需要提交的内容"
  exit 0
fi

# 提交变更
COMMIT_MESSAGE="chore: 自动更新活动日志 - ${CURRENT_DATE}"
echo "💾 提交变更: ${COMMIT_MESSAGE}"
git commit -m "${COMMIT_MESSAGE}"

if [ $? -ne 0 ]; then
  echo "❌ 提交失败"
  exit 1
fi

echo "✅ 提交成功"

# 推送到远程仓库
echo "🚀 推送到 GitHub..."
git push origin main 2>/dev/null || \
git push origin master 2>/dev/null || {
  echo "⚠️  推送失败,尝试设置上游分支..."
  BRANCH=$(git branch --show-current)
  git push --set-upstream origin "${BRANCH}"
}

if [ $? -eq 0 ]; then
  echo "✅ 推送成功"
else
  echo "❌ 推送失败"
  exit 1
fi

echo "=========================================="
echo "✅ 自动提交任务完成"
echo "📊 提交信息: ${COMMIT_MESSAGE}"
echo "🔗 仓库: 632591029/code-consistency-agent-skill"
echo "=========================================="
