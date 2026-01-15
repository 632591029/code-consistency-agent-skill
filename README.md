# Code Consistency Agent Skill - AI团队代码和工程一致性保障系统

## 项目概述

当团队大量使用AI工具时，如何保证代码和工程一致性？Subagent提供了一套完整的解决方案，通过模块化的方式封装不同的职责和能力，确保团队在使用AI辅助开发时保持代码质量和工程规范的一致性。

## 核心模块

### 1. Subagent - 系统架构师和业务框架封装

封装系统架构师角色，提供架构分析和一致性检查能力。

**参考资源：**
- [wshobson/agents](https://github.com/wshobson/agents/tree/main)
- [reactbits.dev](https://reactbits.dev/backgrounds/floating-lines)
- @agent-react-bits-ui-adapter

**功能特性：**
- 架构层次检测
- 设计模式识别
- 一致性评分
- 架构建议生成

**使用示例：**

```typescript
import { createSubagent } from './subagent';

const architect = createSubagent({
  role: 'architect',
  framework: 'Layered Architecture',
});

const result = await architect.analyzeArchitecture(['src/api', 'src/service']);
console.log(result.consistency.score);
```

### 2. SlashCommand - 动作封装（@模式）

使用`@`模式提供专业的命令接口，封装常用动作如需求分析、代码审查等。

**功能特性：**
- `@analyze` - 需求分析
- `@review` - 代码审查
- `@architect` - 架构设计

**使用示例：**

```typescript
import { executeCommand } from './slashcommand';

// 使用@模式执行命令
const result = await executeCommand('@analyze PRD文档内容');
console.log(result.data);
```

### 3. Hooks - 回调封装

封装回调机制，在关键节点自动执行检查，如创建仓库时自动扫描包安全。

**配置示例：**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo '执行bash前的检查'"
          }
        ]
      }
    ],
    "PostRepositoryCreate": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "npm audit"
          }
        ]
      }
    ]
  }
}
```

**使用示例：**

```typescript
import { createHookExecutor, defaultHookConfig } from './hooks';

const executor = createHookExecutor(defaultHookConfig);

// 执行PreToolUse钩子
const result = await executor.executePreToolUse({
  tool: 'bash',
  args: ['npm install'],
});

if (!result.shouldContinue) {
  console.error('钩子检查失败，停止执行');
}
```

### 4. Skill - 工作流封装

封装完整的工作流程，支持复杂的任务编排和执行。

**参考资源：**
- [skillsmp.com](https://skillsmp.com/)

**功能特性：**
- 任务编排
- 条件分支
- 并行执行
- 预定义工作流

**使用示例：**

```typescript
import { createSkillExecutor, predefinedSkills } from './skill';

const executor = createSkillExecutor(predefinedSkills['code-review']);
const results = await executor.execute();

for (const result of results) {
  console.log(`步骤 ${result.stepId}: ${result.success ? '成功' : '失败'}`);
}
```

### 5. MCP - 外部接口封装

封装外部接口调用，支持MCP协议、HTTP和WebSocket。

**参考资源：**
- [mcp.so](https://mcp.so)
- [rube.app](https://rube.app/)

**使用示例：**

```typescript
import { createMCPClient, predefinedMCPConfigs } from './mcp';

const client = createMCPClient(predefinedMCPConfigs['rube']);

const response = await client.call({
  method: 'analyze',
  params: { content: '分析内容' },
});

console.log(response.data);
```

### 6. Plan Model - PRD到开发文档转换

按照PRD文档自动生成开发文档（Markdown格式）。

**参考资源：**
- [chatprd.ai](https://app.chatprd.ai/chat)

**功能特性：**
- PRD解析
- 架构设计生成
- API规范生成
- 数据库设计生成
- 测试计划生成
- Markdown文档输出

**使用示例：**

```typescript
import { createPlanModel } from './plan-model';

const planModel = createPlanModel();

const prd = {
  title: '用户管理系统',
  version: '1.0.0',
  author: '开发团队',
  date: '2024-01-01',
  overview: '用户管理系统的PRD文档',
  requirements: [
    {
      id: 'REQ-001',
      title: '用户注册',
      description: '用户可以通过邮箱注册',
      priority: 'high',
      acceptanceCriteria: ['支持邮箱验证'],
    },
  ],
  features: [
    {
      id: 'FEAT-001',
      name: '用户注册API',
      description: '提供用户注册接口',
      requirements: ['REQ-001'],
    },
  ],
  stakeholders: [],
};

const devDoc = await planModel.convertPRDToDevDoc(prd);
const markdown = await planModel.generateMarkdown(devDoc);

console.log(markdown);
```

## 安装和使用

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

## 项目结构

```
subagent/
├── src/
│   ├── index.ts              # 主入口文件
│   ├── subagent/             # 系统架构师模块
│   ├── slashcommand/         # 命令模块
│   ├── hooks/                # 钩子模块
│   ├── skill/                # 工作流模块
│   ├── mcp/                  # 外部接口模块
│   └── plan-model/           # PRD转换模块
├── hooks.config.json          # 钩子配置文件示例
├── package.json
├── tsconfig.json
└── README.md
```

## 设计理念

1. **模块化设计**：每个模块职责单一，易于扩展和维护
2. **一致性保障**：通过架构分析、代码审查、自动化检查等方式确保一致性
3. **可配置性**：支持灵活的配置，适应不同团队的需求
4. **可扩展性**：提供插件机制，方便添加新的功能和集成

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

