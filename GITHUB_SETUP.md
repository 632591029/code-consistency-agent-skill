# GitHub仓库设置指南

## 方法一：使用脚本（推荐）

运行以下命令：

```bash
./setup-github.sh
```

脚本会引导您完成：
1. 输入GitHub用户名
2. 在GitHub网页上创建仓库
3. 自动配置远程仓库并推送代码

## 方法二：手动设置

### 1. 在GitHub上创建仓库

访问 https://github.com/new 创建新仓库：
- **仓库名称**: `subagent`
- **描述**: `AI团队代码和工程一致性保障系统`
- **可见性**: Public 或 Private（根据您的选择）
- **不要**初始化README、.gitignore或license（我们已经有了）

### 2. 添加远程仓库并推送

```bash
# 替换 YOUR_USERNAME 为您的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/subagent.git
git branch -M main
git push -u origin main
```

### 3. 如果使用SSH（推荐）

```bash
# 替换 YOUR_USERNAME 为您的GitHub用户名
git remote add origin git@github.com:YOUR_USERNAME/subagent.git
git branch -M main
git push -u origin main
```

## 认证说明

如果推送时提示输入密码，请使用：
- **用户名**: 您的GitHub用户名
- **密码**: GitHub Personal Access Token（不是GitHub密码）

创建Token：https://github.com/settings/tokens
- 选择 `repo` 权限
- 生成后复制token作为密码使用

## 完成后的仓库地址

推送成功后，您的仓库地址将是：
`https://github.com/YOUR_USERNAME/subagent`
