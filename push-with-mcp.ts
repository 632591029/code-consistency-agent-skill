#!/usr/bin/env tsx

/**
 * 使用GitHub MCP推送代码到GitHub
 * 
 * 使用方法:
 *   tsx push-with-mcp.ts <GITHUB_TOKEN>
 * 
 * 或者设置环境变量:
 *   export GITHUB_TOKEN=your_token
 *   tsx push-with-mcp.ts
 */

import { pushToGitHubWithMCP } from './src/mcp/github-push.js';

const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;
const OWNER = '632591029';
const REPO = 'code-consistency-agent-skill';

if (!GITHUB_TOKEN) {
  console.error('❌ 错误: 请提供GitHub Personal Access Token');
  console.error('');
  console.error('使用方法:');
  console.error('  tsx push-with-mcp.ts <GITHUB_TOKEN>');
  console.error('');
  console.error('或者设置环境变量:');
  console.error('  export GITHUB_TOKEN=your_token');
  console.error('  tsx push-with-mcp.ts');
  console.error('');
  console.error('创建Token: https://github.com/settings/tokens');
  console.error('需要权限: repo (完整仓库访问权限)');
  process.exit(1);
}

console.log('==========================================');
console.log('使用GitHub MCP推送代码');
console.log('==========================================');
console.log(`仓库: ${OWNER}/${REPO}`);
console.log('');

pushToGitHubWithMCP(GITHUB_TOKEN, {
  owner: OWNER,
  repo: REPO,
  branch: 'main',
})
  .then((result) => {
    if (result.success) {
      console.log('');
      console.log('==========================================');
      console.log('✅ 成功！');
      console.log('==========================================');
      console.log(result.message);
      console.log('');
    } else {
      console.error('');
      console.error('==========================================');
      console.error('❌ 失败');
      console.error('==========================================');
      console.error(result.message);
      console.error('');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('发生错误:', error);
    process.exit(1);
  });

