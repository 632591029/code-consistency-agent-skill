#!/bin/bash

# 自动提交脚本 - 用于维护 GitHub 绿墙
# 每次执行会对项目进行微小但有意义的更新

set -e

# 切换到项目目录
cd /home/ubuntu/code-consistency-agent-skill

# 配置 Git（如果需要）
git config user.name "Auto Commit Bot" || true
git config user.email "bot@example.com" || true

# 获取当前日期和时间
CURRENT_DATE=$(date '+%Y-%m-%d')
CURRENT_TIME=$(date '+%H:%M:%S')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 定义要更新的文件
ACTIVITY_LOG="ACTIVITY.md"

# 如果活动日志不存在，创建它
if [ ! -f "$ACTIVITY_LOG" ]; then
    cat > "$ACTIVITY_LOG" << 'EOF'
# 项目活动日志

本文件记录项目的日常更新和维护活动。

## 更新记录

EOF
    git add "$ACTIVITY_LOG"
    git commit -m "docs: 初始化项目活动日志"
fi

# 生成随机的更新类型
UPDATE_TYPES=(
    "docs: 更新项目文档"
    "docs: 完善使用说明"
    "docs: 优化代码注释"
    "chore: 维护项目配置"
    "docs: 添加使用示例"
    "docs: 更新活动日志"
)

# 随机选择一个更新类型
RANDOM_INDEX=$((RANDOM % ${#UPDATE_TYPES[@]}))
COMMIT_MESSAGE="${UPDATE_TYPES[$RANDOM_INDEX]}"

# 在活动日志中添加新条目
echo "" >> "$ACTIVITY_LOG"
echo "### $TIMESTAMP" >> "$ACTIVITY_LOG"
echo "" >> "$ACTIVITY_LOG"
echo "- 执行自动维护任务" >> "$ACTIVITY_LOG"
echo "- 更新类型: $COMMIT_MESSAGE" >> "$ACTIVITY_LOG"

# 提交更改
git add "$ACTIVITY_LOG"
git commit -m "$COMMIT_MESSAGE

自动提交时间: $TIMESTAMP
" || echo "没有需要提交的更改"

# 推送到远程仓库
git push origin main || git push origin master || echo "推送失败，请检查权限"

echo "✅ 自动提交完成: $TIMESTAMP"
