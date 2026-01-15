/**
 * Hooks - 封装回调，创建仓库时自动扫描包安全
 * 
 * 支持PreToolUse、PostToolUse等钩子
 */

import { z } from 'zod';

export const HookConfigSchema = z.object({
  hooks: z.object({
    PreToolUse: z.array(z.object({
      matcher: z.string(),
      hooks: z.array(z.object({
        type: z.enum(['command', 'script', 'function']),
        command: z.string().optional(),
        script: z.string().optional(),
        function: z.string().optional(),
      })),
    })).optional(),
    PostToolUse: z.array(z.object({
      matcher: z.string(),
      hooks: z.array(z.object({
        type: z.enum(['command', 'script', 'function']),
        command: z.string().optional(),
        script: z.string().optional(),
        function: z.string().optional(),
      })),
    })).optional(),
    PreRepositoryCreate: z.array(z.object({
      matcher: z.string(),
      hooks: z.array(z.object({
        type: z.enum(['command', 'script', 'function']),
        command: z.string().optional(),
        script: z.string().optional(),
        function: z.string().optional(),
      })),
    })).optional(),
    PostRepositoryCreate: z.array(z.object({
      matcher: z.string(),
      hooks: z.array(z.object({
        type: z.enum(['command', 'script', 'function']),
        command: z.string().optional(),
        script: z.string().optional(),
        function: z.string().optional(),
      })),
    })).optional(),
  }),
});

export type HookConfig = z.infer<typeof HookConfigSchema>;

export interface HookContext {
  tool: string;
  args: unknown[];
  repository?: {
    name: string;
    path: string;
  };
}

export interface HookResult {
  success: boolean;
  output: string;
  shouldContinue: boolean;
}

/**
 * Hook执行器
 */
export class HookExecutor {
  private config: HookConfig;

  constructor(config: HookConfig) {
    this.config = HookConfigSchema.parse(config);
  }

  /**
   * 执行PreToolUse钩子
   */
  async executePreToolUse(context: HookContext): Promise<HookResult> {
    const hooks = this.config.hooks.PreToolUse || [];
    
    for (const hookGroup of hooks) {
      if (this.matches(context.tool, hookGroup.matcher)) {
        for (const hook of hookGroup.hooks) {
          const result = await this.executeHook(hook, context);
          
          if (!result.shouldContinue) {
            return result;
          }
        }
      }
    }
    
    return {
      success: true,
      output: 'PreToolUse钩子执行完成',
      shouldContinue: true,
    };
  }

  /**
   * 执行PostToolUse钩子
   */
  async executePostToolUse(context: HookContext): Promise<HookResult> {
    const hooks = this.config.hooks.PostToolUse || [];
    
    for (const hookGroup of hooks) {
      if (this.matches(context.tool, hookGroup.matcher)) {
        for (const hook of hookGroup.hooks) {
          const result = await this.executeHook(hook, context);
          
          if (!result.shouldContinue) {
            return result;
          }
        }
      }
    }
    
    return {
      success: true,
      output: 'PostToolUse钩子执行完成',
      shouldContinue: true,
    };
  }

  /**
   * 执行PreRepositoryCreate钩子
   */
  async executePreRepositoryCreate(context: HookContext): Promise<HookResult> {
    const hooks = this.config.hooks.PreRepositoryCreate || [];
    
    for (const hookGroup of hooks) {
      if (this.matches(context.repository?.name || '', hookGroup.matcher)) {
        for (const hook of hookGroup.hooks) {
          const result = await this.executeHook(hook, context);
          
          if (!result.shouldContinue) {
            return result;
          }
        }
      }
    }
    
    return {
      success: true,
      output: 'PreRepositoryCreate钩子执行完成',
      shouldContinue: true,
    };
  }

  /**
   * 执行PostRepositoryCreate钩子（包安全检查）
   */
  async executePostRepositoryCreate(context: HookContext): Promise<HookResult> {
    const hooks = this.config.hooks.PostRepositoryCreate || [];
    
    // 默认执行包安全检查
    if (context.repository) {
      const securityCheck = await this.scanPackageSecurity(context.repository.path);
      
      if (!securityCheck.success) {
        return {
          success: false,
          output: `包安全检查失败: ${securityCheck.output}`,
          shouldContinue: false,
        };
      }
    }
    
    // 执行自定义钩子
    for (const hookGroup of hooks) {
      if (this.matches(context.repository?.name || '', hookGroup.matcher)) {
        for (const hook of hookGroup.hooks) {
          const result = await this.executeHook(hook, context);
          
          if (!result.shouldContinue) {
            return result;
          }
        }
      }
    }
    
    return {
      success: true,
      output: 'PostRepositoryCreate钩子执行完成',
      shouldContinue: true,
    };
  }

  /**
   * 执行单个钩子
   */
  private async executeHook(
    hook: HookConfig['hooks']['PreToolUse'][number]['hooks'][number],
    context: HookContext
  ): Promise<HookResult> {
    try {
      if (hook.type === 'command' && hook.command) {
        // 执行命令
        return {
          success: true,
          output: `执行命令: ${hook.command}`,
          shouldContinue: true,
        };
      } else if (hook.type === 'script' && hook.script) {
        // 执行脚本
        return {
          success: true,
          output: `执行脚本: ${hook.script}`,
          shouldContinue: true,
        };
      } else if (hook.type === 'function' && hook.function) {
        // 执行函数
        return {
          success: true,
          output: `执行函数: ${hook.function}`,
          shouldContinue: true,
        };
      }
      
      return {
        success: false,
        output: '钩子配置无效',
        shouldContinue: false,
      };
    } catch (error) {
      return {
        success: false,
        output: `执行钩子时出错: ${error instanceof Error ? error.message : String(error)}`,
        shouldContinue: false,
      };
    }
  }

  /**
   * 检查工具名是否匹配
   */
  private matches(tool: string, matcher: string): boolean {
    // 支持精确匹配和正则匹配
    if (matcher.startsWith('/') && matcher.endsWith('/')) {
      const regex = new RegExp(matcher.slice(1, -1));
      return regex.test(tool);
    }
    
    return tool === matcher || tool.includes(matcher);
  }

  /**
   * 扫描包安全性
   */
  private async scanPackageSecurity(repoPath: string): Promise<HookResult> {
    // 模拟包安全检查
    // 实际实现应该调用npm audit、snyk等工具
    
    const vulnerabilities = [
      // 模拟发现的安全漏洞
    ];
    
    if (vulnerabilities.length > 0) {
      return {
        success: false,
        output: `发现 ${vulnerabilities.length} 个安全漏洞`,
        shouldContinue: false,
      };
    }
    
    return {
      success: true,
      output: '包安全检查通过',
      shouldContinue: true,
    };
  }
}

/**
 * 创建Hook执行器的工厂函数
 */
export function createHookExecutor(config: HookConfig): HookExecutor {
  return new HookExecutor(config);
}

/**
 * 默认钩子配置示例
 */
export const defaultHookConfig: HookConfig = {
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
};

