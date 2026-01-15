/**
 * 配置文件 - 统一管理各个模块的配置
 */

import { SubagentConfig } from '../subagent/index.js';
import { HookConfig } from '../hooks/index.js';
import { SkillConfig } from '../skill/index.js';
import { MCPConfig } from '../mcp/index.js';

export interface SubagentSystemConfig {
  subagent?: SubagentConfig;
  hooks?: HookConfig;
  skills?: Record<string, SkillConfig>;
  mcp?: Record<string, MCPConfig>;
}

/**
 * 默认系统配置
 */
export const defaultSystemConfig: SubagentSystemConfig = {
  subagent: {
    role: 'architect',
    framework: 'Layered Architecture',
  },
  hooks: {
    hooks: {
      PreToolUse: [
        {
          matcher: 'bash',
          hooks: [
            {
              type: 'command',
              command: "echo '执行bash前的检查'",
            },
          ],
        },
      ],
      PostRepositoryCreate: [
        {
          matcher: '.*',
          hooks: [
            {
              type: 'command',
              command: 'npm audit',
            },
          ],
        },
      ],
    },
  },
  skills: {
    'code-review': {
      name: '代码审查工作流',
      description: '自动化的代码审查流程',
      steps: [
        {
          id: '1',
          name: '静态分析',
          type: 'task',
          action: '@analyze',
          next: ['2'],
        },
        {
          id: '2',
          name: '安全检查',
          type: 'task',
          action: '@security-check',
          next: ['3'],
        },
        {
          id: '3',
          name: '生成报告',
          type: 'task',
          action: '@generate-report',
        },
      ],
    },
  },
  mcp: {
    'rube': {
      name: 'rube',
      url: 'https://rube.app/api',
      protocol: 'http',
      endpoints: {
        'analyze': '/analyze',
        'generate': '/generate',
      },
    },
  },
};

/**
 * 从文件加载配置
 */
export async function loadConfigFromFile(filePath: string): Promise<SubagentSystemConfig> {
  try {
    const config = await import(filePath);
    return config.default || config;
  } catch (error) {
    console.warn(`无法加载配置文件 ${filePath}，使用默认配置`);
    return defaultSystemConfig;
  }
}

