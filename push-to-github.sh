#!/bin/bash

# GitHub仓库推送脚本
# 使用方法: ./push-to-github.sh <your-github-username> <repository-name>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "使用方法: ./push-to-github.sh <your-github-username> <repository-name>"
    echo "示例: ./push-to-github.sh yourusername subagent"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "准备推送到: ${REMOTE_URL}"
echo ""
echo "请确保您已经在GitHub上创建了仓库: ${REPO_NAME}"
echo "如果还没有创建，请访问: https://github.com/new"
echo ""
read -p "按Enter继续，或Ctrl+C取消..."

# 检查是否已有远程仓库
if git remote get-url origin >/dev/null 2>&1; then
    echo "更新远程仓库地址..."
    git remote set-url origin "${REMOTE_URL}"
else
    echo "添加远程仓库..."
    git remote add origin "${REMOTE_URL}"
fi

# 推送代码
echo "推送代码到GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到GitHub!"
    echo "仓库地址: ${REMOTE_URL}"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. 是否已在GitHub上创建了仓库"
    echo "2. 是否有推送权限"
    echo "3. 网络连接是否正常"
fi

