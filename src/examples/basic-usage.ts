/**
 * 基础使用示例
 * 
 * 演示如何使用Subagent的各个模块
 */

import { createSubagent } from '../subagent/index.js';
import { executeCommand } from '../slashcommand/index.js';
import { createHookExecutor, defaultHookConfig } from '../hooks/index.js';
import { createSkillExecutor, predefinedSkills } from '../skill/index.js';
import { createMCPClient, predefinedMCPConfigs } from '../mcp/index.js';
import { createPlanModel } from '../plan-model/index.js';

/**
 * Subagent使用示例
 */
async function subagentExample() {
  console.log('=== Subagent示例 ===');
  
  const architect = createSubagent({
    role: 'architect',
    framework: 'Layered Architecture',
  });

  const result = await architect.analyzeArchitecture([
    'src/api/user.ts',
    'src/service/userService.ts',
    'src/repository/userRepository.ts',
  ]);

  console.log('架构层次:', result.architecture.layers);
  console.log('设计模式:', result.architecture.patterns);
  console.log('一致性分数:', result.consistency.score);
  console.log('问题:', result.consistency.issues);
  console.log('建议:', result.suggestions);
}

/**
 * SlashCommand使用示例
 */
async function slashCommandExample() {
  console.log('\n=== SlashCommand示例 ===');
  
  // 使用@analyze命令进行需求分析
  const analyzeResult = await executeCommand('@analyze 用户管理系统需要支持用户注册、登录、个人信息管理功能');
  console.log('需求分析结果:', analyzeResult.data);

  // 使用@architect命令进行架构设计
  const architectResult = await executeCommand('@architect 需要支持RESTful API和数据库存储');
  console.log('架构设计结果:', architectResult.data);
}

/**
 * Hooks使用示例
 */
async function hooksExample() {
  console.log('\n=== Hooks示例 ===');
  
  const executor = createHookExecutor(defaultHookConfig);

  // 执行PreToolUse钩子
  const preResult = await executor.executePreToolUse({
    tool: 'bash',
    args: ['npm install'],
  });
  console.log('PreToolUse结果:', preResult.output);

  // 执行PostRepositoryCreate钩子（包安全检查）
  const postResult = await executor.executePostRepositoryCreate({
    tool: 'create-repo',
    args: [],
    repository: {
      name: 'my-project',
      path: './my-project',
    },
  });
  console.log('PostRepositoryCreate结果:', postResult.output);
}

/**
 * Skill使用示例
 */
async function skillExample() {
  console.log('\n=== Skill示例 ===');
  
  const executor = createSkillExecutor(predefinedSkills['code-review']);
  const results = await executor.execute();

  console.log('工作流执行结果:');
  for (const result of results) {
    console.log(`  步骤 ${result.stepId}: ${result.success ? '✓' : '✗'} ${result.output}`);
  }
}

/**
 * MCP使用示例
 */
async function mcpExample() {
  console.log('\n=== MCP示例 ===');
  
  const client = createMCPClient(predefinedMCPConfigs['rube']);

  // 测试连接
  const connected = await client.testConnection();
  console.log('MCP连接状态:', connected ? '已连接' : '连接失败');

  // 调用MCP接口
  const response = await client.call({
    method: 'analyze',
    params: {
      content: '分析这段代码的质量',
    },
  });

  console.log('MCP调用结果:', response.data);
}

/**
 * Plan Model使用示例
 */
async function planModelExample() {
  console.log('\n=== Plan Model示例 ===');
  
  const planModel = createPlanModel();

  const prd = {
    title: '用户管理系统',
    version: '1.0.0',
    author: '开发团队',
    date: '2024-01-01',
    overview: '这是一个用户管理系统，支持用户的注册、登录、个人信息管理等功能。',
    requirements: [
      {
        id: 'REQ-001',
        title: '用户注册API',
        description: '提供用户注册接口，支持邮箱和密码注册',
        priority: 'high' as const,
        acceptanceCriteria: [
          '支持邮箱格式验证',
          '密码强度验证',
          '返回注册结果',
        ],
      },
      {
        id: 'REQ-002',
        title: '用户登录API',
        description: '提供用户登录接口，支持邮箱和密码登录',
        priority: 'high' as const,
        acceptanceCriteria: [
          '验证用户凭证',
          '返回JWT token',
        ],
      },
    ],
    features: [
      {
        id: 'FEAT-001',
        name: '用户注册功能',
        description: '实现用户注册API和业务逻辑',
        requirements: ['REQ-001'],
      },
      {
        id: 'FEAT-002',
        name: '用户登录功能',
        description: '实现用户登录API和业务逻辑',
        requirements: ['REQ-002'],
      },
    ],
    stakeholders: [
      {
        name: '产品经理',
        role: 'Product Manager',
        concerns: ['功能完整性', '用户体验'],
      },
    ],
  };

  // 转换为开发文档
  const devDoc = await planModel.convertPRDToDevDoc(prd);
  console.log('开发文档标题:', devDoc.title);
  console.log('架构模式:', devDoc.architecture.pattern);
  console.log('模块数量:', devDoc.modules.length);

  // 生成Markdown文档
  const markdown = await planModel.generateMarkdown(devDoc);
  console.log('\n生成的Markdown文档:');
  console.log(markdown.substring(0, 500) + '...');
}

/**
 * 运行所有示例
 */
async function runAllExamples() {
  try {
    await subagentExample();
    await slashCommandExample();
    await hooksExample();
    await skillExample();
    await mcpExample();
    await planModelExample();
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
}

// 如果直接运行此文件，执行所有示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

