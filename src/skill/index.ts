/**
 * Skill - 封装工作流
 * 
 * 参考：https://skillsmp.com/
 */

import { z } from 'zod';

export const SkillConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['task', 'decision', 'parallel', 'condition']),
    action: z.string(),
    condition: z.string().optional(),
    next: z.array(z.string()).optional(),
  })),
  inputs: z.record(z.unknown()).optional(),
  outputs: z.record(z.unknown()).optional(),
});

export type SkillConfig = z.infer<typeof SkillConfigSchema>;

export interface SkillExecutionContext {
  stepId: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface SkillExecutionResult {
  success: boolean;
  stepId: string;
  output: unknown;
  nextSteps: string[];
}

/**
 * Skill工作流执行器
 */
export class SkillExecutor {
  private config: SkillConfig;
  private executionContext: SkillExecutionContext;

  constructor(config: SkillConfig) {
    this.config = SkillConfigSchema.parse(config);
    this.executionContext = {
      stepId: this.config.steps[0]?.id || '',
      inputs: this.config.inputs || {},
      outputs: {},
    };
  }

  /**
   * 执行工作流
   */
  async execute(): Promise<SkillExecutionResult[]> {
    const results: SkillExecutionResult[] = [];
    const visitedSteps = new Set<string>();
    let currentStepId = this.config.steps[0]?.id;

    while (currentStepId) {
      if (visitedSteps.has(currentStepId)) {
        // 防止无限循环
        break;
      }

      visitedSteps.add(currentStepId);
      const step = this.config.steps.find(s => s.id === currentStepId);

      if (!step) {
        break;
      }

      const result = await this.executeStep(step);
      results.push(result);

      if (!result.success) {
        break;
      }

      // 确定下一步
      currentStepId = this.determineNextStep(step, result);
    }

    return results;
  }

  /**
   * 执行单个步骤
   */
  private async executeStep(step: SkillConfig['steps'][number]): Promise<SkillExecutionResult> {
    try {
      let output: unknown;

      switch (step.type) {
        case 'task':
          output = await this.executeTask(step);
          break;
        case 'decision':
          output = await this.executeDecision(step);
          break;
        case 'parallel':
          output = await this.executeParallel(step);
          break;
        case 'condition':
          output = await this.executeCondition(step);
          break;
        default:
          output = null;
      }

      const nextSteps = step.next || [];

      return {
        success: true,
        stepId: step.id,
        output,
        nextSteps,
      };
    } catch (error) {
      return {
        success: false,
        stepId: step.id,
        output: null,
        nextSteps: [],
      };
    }
  }

  /**
   * 执行任务
   */
  private async executeTask(step: SkillConfig['steps'][number]): Promise<unknown> {
    // 根据action执行相应的任务
    const action = step.action;

    // 这里可以根据不同的action类型执行不同的逻辑
    if (action.startsWith('@')) {
      // 调用slashcommand
      return { command: action, result: 'executed' };
    } else if (action.startsWith('http')) {
      // 调用HTTP接口
      return { url: action, result: 'fetched' };
    } else {
      // 执行自定义逻辑
      return { action, result: 'completed' };
    }
  }

  /**
   * 执行决策
   */
  private async executeDecision(step: SkillConfig['steps'][number]): Promise<unknown> {
    // 根据条件执行决策逻辑
    const condition = step.condition || '';
    
    // 简单的条件评估
    const result = this.evaluateCondition(condition);
    
    return {
      condition,
      result,
      decision: result ? 'yes' : 'no',
    };
  }

  /**
   * 执行并行任务
   */
  private async executeParallel(step: SkillConfig['steps'][number]): Promise<unknown> {
    // 执行并行任务
    const nextSteps = step.next || [];
    
    const results = await Promise.all(
      nextSteps.map(async (nextStepId) => {
        const nextStep = this.config.steps.find(s => s.id === nextStepId);
        if (nextStep) {
          return await this.executeStep(nextStep);
        }
        return null;
      })
    );

    return {
      parallel: true,
      results: results.filter(r => r !== null),
    };
  }

  /**
   * 执行条件判断
   */
  private async executeCondition(step: SkillConfig['steps'][number]): Promise<unknown> {
    const condition = step.condition || '';
    const result = this.evaluateCondition(condition);
    
    return {
      condition,
      result,
    };
  }

  /**
   * 评估条件
   */
  private evaluateCondition(condition: string): boolean {
    // 简单的条件评估逻辑
    // 实际实现应该支持更复杂的表达式
    
    if (!condition) {
      return true;
    }

    // 检查输入中是否存在某个值
    const match = condition.match(/\$\{(\w+)\}/);
    if (match) {
      const key = match[1];
      return key in this.executionContext.inputs;
    }

    return true;
  }

  /**
   * 确定下一步
   */
  private determineNextStep(
    step: SkillConfig['steps'][number],
    result: SkillExecutionResult
  ): string | undefined {
    if (step.next && step.next.length > 0) {
      // 如果有多个下一步，根据结果选择
      if (step.type === 'decision' || step.type === 'condition') {
        // 根据决策结果选择下一步
        const decisionResult = result.output as { decision?: string; result?: boolean };
        
        if (decisionResult.decision === 'yes' && step.next[0]) {
          return step.next[0];
        } else if (decisionResult.decision === 'no' && step.next[1]) {
          return step.next[1];
        }
      }
      
      return step.next[0];
    }

    return undefined;
  }
}

/**
 * 创建Skill执行器的工厂函数
 */
export function createSkillExecutor(config: SkillConfig): SkillExecutor {
  return new SkillExecutor(config);
}

/**
 * 预定义的工作流技能
 */
export const predefinedSkills: Record<string, SkillConfig> = {
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
  'feature-development': {
    name: '功能开发工作流',
    description: '从需求到部署的完整流程',
    steps: [
      {
        id: '1',
        name: '需求分析',
        type: 'task',
        action: '@analyze',
        next: ['2'],
      },
      {
        id: '2',
        name: '架构设计',
        type: 'task',
        action: '@architect',
        next: ['3'],
      },
      {
        id: '3',
        name: '代码实现',
        type: 'task',
        action: '@implement',
        next: ['4'],
      },
      {
        id: '4',
        name: '测试',
        type: 'task',
        action: '@test',
        next: ['5'],
      },
      {
        id: '5',
        name: '部署',
        type: 'task',
        action: '@deploy',
      },
    ],
  },
};

