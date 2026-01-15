# 推送代码到GitHub指南

仓库已配置完成，现在需要推送代码。有两种方式：

## 方式一：使用Personal Access Token（推荐）

### 1. 创建Personal Access Token

访问：https://github.com/settings/tokens

1. 点击 "Generate new token" -> "Generate new token (classic)"
2. 设置名称：`code-consistency-agent-skill`
3. 选择权限：勾选 `repo`（完整仓库访问权限）
4. 点击 "Generate token"
5. **复制token**（只显示一次，请保存好）

### 2. 使用Token推送

```bash
# 切换回HTTPS方式
git remote set-url origin https://github.com/632591029/code-consistency-agent-skill.git

# 推送代码（会提示输入用户名和密码）
git push -u origin main
# 用户名：632591029
# 密码：粘贴刚才复制的Personal Access Token
```

## 方式二：配置SSH密钥

### 1. 检查SSH密钥是否已添加到GitHub

```bash
# 查看您的公钥
cat ~/.ssh/id_rsa.pub
```

### 2. 将SSH公钥添加到GitHub

1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. 标题：`MacBook`（或任意名称）
4. 密钥：粘贴 `~/.ssh/id_rsa.pub` 的内容
5. 点击 "Add SSH key"

### 3. 测试SSH连接

```bash
ssh -T git@github.com
```

### 4. 推送代码

```bash
# 确保使用SSH方式
git remote set-url origin git@github.com:632591029/code-consistency-agent-skill.git

# 推送代码
git push -u origin main
```

## 快速推送命令（使用Token方式）

如果您已经创建了Personal Access Token，可以直接执行：

```bash
git remote set-url origin https://github.com/632591029/code-consistency-agent-skill.git
git push -u origin main
```

然后在提示时：
- Username: `632591029`
- Password: `您的Personal Access Token`

## 仓库信息

- **仓库地址**: https://github.com/632591029/code-consistency-agent-skill
- **用户名**: 632591029
- **邮箱**: 632591029@qq.com

