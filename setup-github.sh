#!/bin/bash

# GitHub仓库设置脚本

echo "=========================================="
echo "GitHub仓库设置向导"
echo "=========================================="
echo ""

# 获取GitHub用户名
read -p "请输入您的GitHub用户名: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub用户名不能为空"
    exit 1
fi

REPO_NAME="subagent"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "仓库信息:"
echo "  用户名: ${GITHUB_USER}"
echo "  仓库名: ${REPO_NAME}"
echo "  完整URL: ${REMOTE_URL}"
echo ""

# 检查是否已在GitHub上创建了仓库
echo "请确保您已经在GitHub上创建了仓库 '${REPO_NAME}'"
echo "如果还没有创建，请访问: https://github.com/new"
echo "  仓库名称: ${REPO_NAME}"
echo "  描述: AI团队代码和工程一致性保障系统"
echo "  可见性: Public 或 Private（根据您的选择）"
echo ""
read -p "创建完成后，按Enter继续..."

# 设置远程仓库
echo ""
echo "配置Git远程仓库..."
if git remote get-url origin >/dev/null 2>&1; then
    echo "更新远程仓库地址..."
    git remote set-url origin "${REMOTE_URL}"
else
    echo "添加远程仓库..."
    git remote add origin "${REMOTE_URL}"
fi

# 确保在main分支
git branch -M main

# 推送代码
echo ""
echo "推送代码到GitHub..."
echo "如果提示输入用户名和密码，请使用GitHub Personal Access Token作为密码"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ 成功！代码已推送到GitHub"
    echo "=========================================="
    echo ""
    echo "仓库地址: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "❌ 推送失败"
    echo "=========================================="
    echo ""
    echo "可能的原因："
    echo "1. 仓库尚未在GitHub上创建"
    echo "2. 认证失败（请使用Personal Access Token）"
    echo "3. 网络连接问题"
    echo ""
    echo "手动推送命令："
    echo "  git remote add origin ${REMOTE_URL}"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    echo ""
fi

