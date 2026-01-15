/**
 * 使用GitHub MCP推送代码到GitHub
 */

import { createGitHubMCPClient } from './github.js';
import { execSync } from 'child_process';

export interface PushOptions {
  owner: string;
  repo: string;
  branch?: string;
  remote?: string;
}

/**
 * 使用GitHub MCP验证并推送代码
 */
export async function pushToGitHubWithMCP(
  token: string,
  options: PushOptions
): Promise<{ success: boolean; message: string }> {
  const client = createGitHubMCPClient(token);
  const branch = options.branch || 'main';
  const remote = options.remote || 'origin';

  try {
    // 1. 验证仓库访问权限
    console.log(`验证仓库访问权限: ${options.owner}/${options.repo}...`);
    const hasAccess = await client.verifyAccess(options.owner, options.repo);
    
    if (!hasAccess) {
      return {
        success: false,
        message: '无法访问仓库，请检查token权限和仓库是否存在',
      };
    }

    console.log('✅ 仓库访问验证成功');

    // 2. 配置git远程仓库
    const repoUrl = `https://${token}@github.com/${options.owner}/${options.repo}.git`;
    
    try {
      execSync(`git remote remove ${remote}`, { stdio: 'ignore' });
    } catch {
      // 远程不存在，继续
    }

    execSync(`git remote add ${remote} ${repoUrl}`, { stdio: 'inherit' });
    console.log(`✅ 已配置远程仓库: ${remote}`);

    // 3. 确保在正确的分支
    try {
      execSync(`git branch -M ${branch}`, { stdio: 'inherit' });
    } catch {
      // 分支已存在或不需要重命名
    }

    // 4. 推送代码
    console.log(`推送代码到 ${branch} 分支...`);
    execSync(`git push -u ${remote} ${branch}`, { stdio: 'inherit' });

    return {
      success: true,
      message: `代码已成功推送到 https://github.com/${options.owner}/${options.repo}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

