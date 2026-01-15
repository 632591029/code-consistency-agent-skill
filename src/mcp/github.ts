/**
 * GitHub MCP集成
 * 
 * 参考：https://github.com/github/github-mcp-server
 * 使用GitHub官方MCP服务器进行仓库操作
 */

import { MCPClient, MCPRequest, MCPResponse } from './index.js';

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
}

export interface GitHubCreateRepoParams {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
}

export interface GitHubFileContent {
  path: string;
  content: string;
  message: string;
  branch?: string;
}

/**
 * GitHub MCP客户端扩展
 */
export class GitHubMCPClient {
  private client: MCPClient;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.client = new MCPClient({
      name: 'github',
      url: 'https://api.github.com',
      protocol: 'http',
      authentication: {
        type: 'bearer',
        token: token,
      },
    });
  }

  /**
   * 创建GitHub仓库
   */
  async createRepository(params: GitHubCreateRepoParams): Promise<MCPResponse> {
    return await this.client.call({
      method: 'create-repo',
      params: params,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  }

  /**
   * 获取仓库信息
   */
  async getRepository(owner: string, repo: string): Promise<MCPResponse> {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `获取仓库失败: ${response.status} ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 检查仓库是否存在
   */
  async repositoryExists(owner: string, repo: string): Promise<boolean> {
    const result = await this.getRepository(owner, repo);
    return result.success;
  }

  /**
   * 创建或更新文件
   */
  async createOrUpdateFile(
    owner: string,
    repo: string,
    fileContent: GitHubFileContent
  ): Promise<MCPResponse> {
    // 先检查文件是否存在
    const checkUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileContent.path}`;
    
    let sha: string | undefined;
    try {
      const checkResponse = await fetch(checkUrl, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (checkResponse.ok) {
        const fileData = await checkResponse.json();
        sha = fileData.sha;
      }
    } catch {
      // 文件不存在，继续创建
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileContent.path}`;
    const body: Record<string, unknown> = {
      message: fileContent.message,
      content: Buffer.from(fileContent.content).toString('base64'),
    };

    if (sha) {
      body.sha = sha;
    }

    if (fileContent.branch) {
      body.branch = fileContent.branch;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: `创建/更新文件失败: ${response.status} ${errorData.message || response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 推送代码到GitHub（通过API）
   * 注意：GitHub API不支持直接推送，需要通过git命令
   * 这个方法主要用于验证仓库和token
   */
  async verifyAccess(owner: string, repo: string): Promise<boolean> {
    const result = await this.getRepository(owner, repo);
    return result.success;
  }
}

/**
 * 创建GitHub MCP客户端
 */
export function createGitHubMCPClient(token: string): GitHubMCPClient {
  return new GitHubMCPClient(token);
}

