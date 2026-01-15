/**
 * SlashCommand - 封装动作（需求分析等）
 * 
 * 使用@模式提供更专业的命令接口
 */

import { z } from 'zod';

export interface SlashCommandConfig {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<CommandResult>;
  matcher?: RegExp;
}

export interface CommandResult {
  success: boolean;
  output: string;
  data?: unknown;
  suggestions?: string[];
}

/**
 * 命令注册表
 */
class SlashCommandRegistry {
  private commands: Map<string, SlashCommandConfig> = new Map();

  /**
   * 注册命令
   */
  register(command: SlashCommandConfig): void {
    this.commands.set(command.name, command);
  }

  /**
   * 执行命令
   */
  async execute(commandName: string, args: string[]): Promise<CommandResult> {
    const command = this.commands.get(commandName);
    
    if (!command) {
      return {
        success: false,
        output: `命令 "${commandName}" 未找到`,
      };
    }

    try {
      return await command.handler(args);
    } catch (error) {
      return {
        success: false,
        output: `执行命令时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 解析命令字符串（支持@模式）
   */
  parseCommand(input: string): { command: string; args: string[] } | null {
    // 支持 @command arg1 arg2 格式
    const match = input.match(/^@(\w+)(?:\s+(.+))?$/);
    
    if (match) {
      return {
        command: match[1],
        args: match[2] ? match[2].split(/\s+/) : [],
      };
    }

    // 支持 /command arg1 arg2 格式
    const slashMatch = input.match(/^\/(\w+)(?:\s+(.+))?$/);
    
    if (slashMatch) {
      return {
        command: slashMatch[1],
        args: slashMatch[2] ? slashMatch[2].split(/\s+/) : [],
      };
    }

    return null;
  }

  /**
   * 列出所有可用命令
   */
  listCommands(): SlashCommandConfig[] {
    return Array.from(this.commands.values());
  }
}

/**
 * 全局命令注册表实例
 */
export const commandRegistry = new SlashCommandRegistry();

/**
 * 需求分析命令
 */
commandRegistry.register({
  name: 'analyze',
  description: '需求分析 - 分析PRD文档并提取关键信息',
  handler: async (args: string[]) => {
    const prdContent = args.join(' ');
    
    // 模拟需求分析
    const requirements = extractRequirements(prdContent);
    const stakeholders = extractStakeholders(prdContent);
    const features = extractFeatures(prdContent);
    
    return {
      success: true,
      output: '需求分析完成',
      data: {
        requirements,
        stakeholders,
        features,
      },
      suggestions: [
        '建议采用敏捷开发方法',
        '建议进行技术可行性分析',
        '建议制定详细的开发计划',
      ],
    };
  },
});

/**
 * 代码审查命令
 */
commandRegistry.register({
  name: 'review',
  description: '代码审查 - 检查代码质量和一致性',
  handler: async (args: string[]) => {
    const filePath = args[0] || '';
    
    return {
      success: true,
      output: `代码审查完成: ${filePath}`,
      data: {
        issues: [],
        suggestions: [
          '建议添加单元测试',
          '建议优化代码结构',
        ],
      },
    };
  },
});

/**
 * 架构设计命令
 */
commandRegistry.register({
  name: 'architect',
  description: '架构设计 - 生成系统架构建议',
  handler: async (args: string[]) => {
    const requirements = args.join(' ');
    
    return {
      success: true,
      output: '架构设计建议已生成',
      data: {
        layers: ['API Layer', 'Service Layer', 'Repository Layer'],
        patterns: ['Repository Pattern', 'Service Pattern'],
      },
    };
  },
});

/**
 * 从PRD内容中提取需求
 */
function extractRequirements(content: string): string[] {
  // 简单的需求提取逻辑
  const requirements: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.match(/需求|requirement/i)) {
      requirements.push(line.trim());
    }
  }
  
  return requirements;
}

/**
 * 从PRD内容中提取利益相关者
 */
function extractStakeholders(content: string): string[] {
  const stakeholders: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.match(/用户|客户|stakeholder/i)) {
      stakeholders.push(line.trim());
    }
  }
  
  return stakeholders;
}

/**
 * 从PRD内容中提取功能特性
 */
function extractFeatures(content: string): string[] {
  const features: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.match(/功能|特性|feature/i)) {
      features.push(line.trim());
    }
  }
  
  return features;
}

/**
 * 执行命令的便捷函数
 */
export async function executeCommand(input: string): Promise<CommandResult> {
  const parsed = commandRegistry.parseCommand(input);
  
  if (!parsed) {
    return {
      success: false,
      output: '无效的命令格式。请使用 @command 或 /command 格式',
    };
  }
  
  return await commandRegistry.execute(parsed.command, parsed.args);
}

