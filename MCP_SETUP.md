# Cursor MCP 服务器配置指南

## GitHub MCP 服务器配置

已为您配置了 GitHub MCP 服务器，配置文件位于 `.cursor/mcp.json`。

### 配置说明

配置文件内容：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 使用方法

1. **确保配置文件存在**：
   - 配置文件位于项目根目录的 `.cursor/mcp.json`
   - 如果不存在，请创建该文件并填入上述配置

2. **设置GitHub Token**：
   - 将 `GITHUB_PERSONAL_ACCESS_TOKEN` 替换为您的GitHub Personal Access Token
   - 创建Token：https://github.com/settings/tokens
   - 需要权限：`repo`（完整仓库访问权限）

3. **重启Cursor**：
   - 配置完成后，重启Cursor IDE以使配置生效

4. **验证配置**：
   - 在Cursor中，MCP服务器应该会自动连接
   - 您可以在Cursor的设置中查看MCP服务器状态

### GitHub MCP 服务器功能

配置成功后，您可以在Cursor中直接使用以下GitHub操作：

- 创建仓库
- 获取仓库信息
- 创建/更新文件
- 管理Issues和Pull Requests
- 查看代码和提交历史

### 注意事项

- `.cursor/mcp.json` 文件包含敏感信息（GitHub Token），已添加到 `.gitignore`
- 请勿将包含真实Token的配置文件提交到Git仓库
- 示例配置文件 `.cursor/mcp.json.example` 已创建，可以提交到仓库作为参考

### 参考资源

- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Cursor MCP 文档](https://docs.cursor.com/zh/context/mcp)

