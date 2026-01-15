/**
 * Plan Model - PRD到开发文档转换
 * 
 * 参考：https://app.chatprd.ai/chat
 * 功能：按照PRD写开发md文档
 */

import { z } from 'zod';

export interface PRDDocument {
  title: string;
  version: string;
  author: string;
  date: string;
  overview: string;
  requirements: Requirement[];
  features: Feature[];
  stakeholders: Stakeholder[];
  timeline?: Timeline;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  acceptanceCriteria: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  dependencies?: string[];
}

export interface Stakeholder {
  name: string;
  role: string;
  concerns: string[];
}

export interface Timeline {
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  date: string;
  deliverables: string[];
}

export interface DevelopmentDocument {
  title: string;
  version: string;
  overview: string;
  architecture: Architecture;
  modules: Module[];
  api: APISpec[];
  database: DatabaseSchema[];
  testing: TestingPlan;
  deployment: DeploymentPlan;
}

export interface Architecture {
  pattern: string;
  layers: string[];
  technologies: string[];
  diagrams?: string[];
}

export interface Module {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  tests: string[];
}

export interface APISpec {
  endpoint: string;
  method: string;
  description: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
}

export interface DatabaseSchema {
  table: string;
  fields: Record<string, string>;
  indexes: string[];
  relationships: string[];
}

export interface TestingPlan {
  unitTests: string[];
  integrationTests: string[];
  e2eTests: string[];
}

export interface DeploymentPlan {
  environment: string;
  steps: string[];
  rollback: string[];
}

/**
 * PRD到开发文档转换器
 */
export class PlanModel {
  /**
   * 将PRD转换为开发文档
   */
  async convertPRDToDevDoc(prd: PRDDocument): Promise<DevelopmentDocument> {
    const architecture = this.generateArchitecture(prd);
    const modules = this.generateModules(prd);
    const api = this.generateAPISpecs(prd);
    const database = this.generateDatabaseSchema(prd);
    const testing = this.generateTestingPlan(prd);
    const deployment = this.generateDeploymentPlan(prd);

    return {
      title: `${prd.title} - 开发文档`,
      version: prd.version,
      overview: prd.overview,
      architecture,
      modules,
      api,
      database,
      testing,
      deployment,
    };
  }

  /**
   * 生成架构设计
   */
  private generateArchitecture(prd: PRDDocument): Architecture {
    const layers: string[] = [];
    const technologies: string[] = [];

    // 根据需求分析架构层次
    if (prd.requirements.some(r => r.title.includes('API') || r.title.includes('接口'))) {
      layers.push('API Layer');
    }
    if (prd.requirements.some(r => r.title.includes('业务') || r.title.includes('Business'))) {
      layers.push('Business Layer');
    }
    if (prd.requirements.some(r => r.title.includes('数据') || r.title.includes('Data'))) {
      layers.push('Data Layer');
    }

    // 推荐技术栈
    technologies.push('TypeScript');
    technologies.push('Node.js');
    if (prd.requirements.some(r => r.title.includes('前端') || r.title.includes('Frontend'))) {
      technologies.push('React');
    }
    if (prd.requirements.some(r => r.title.includes('数据库') || r.title.includes('Database'))) {
      technologies.push('PostgreSQL');
    }

    return {
      pattern: 'Layered Architecture',
      layers: layers.length > 0 ? layers : ['API Layer', 'Business Layer', 'Data Layer'],
      technologies: technologies.length > 0 ? technologies : ['TypeScript', 'Node.js'],
    };
  }

  /**
   * 生成模块设计
   */
  private generateModules(prd: PRDDocument): Module[] {
    return prd.features.map(feature => ({
      name: feature.name,
      description: feature.description,
      files: [
        `${feature.name.toLowerCase()}.ts`,
        `${feature.name.toLowerCase()}.test.ts`,
      ],
      dependencies: feature.dependencies || [],
      tests: [
        `${feature.name.toLowerCase()}.test.ts`,
      ],
    }));
  }

  /**
   * 生成API规范
   */
  private generateAPISpecs(prd: PRDDocument): APISpec[] {
    const specs: APISpec[] = [];

    for (const feature of prd.features) {
      if (feature.name.includes('API') || feature.name.includes('接口')) {
        specs.push({
          endpoint: `/api/${feature.name.toLowerCase()}`,
          method: 'POST',
          description: feature.description,
          request: {
            body: 'object',
          },
          response: {
            success: 'boolean',
            data: 'object',
          },
        });
      }
    }

    return specs.length > 0 ? specs : [
      {
        endpoint: '/api/health',
        method: 'GET',
        description: '健康检查接口',
        request: {},
        response: {
          status: 'string',
        },
      },
    ];
  }

  /**
   * 生成数据库架构
   */
  private generateDatabaseSchema(prd: PRDDocument): DatabaseSchema[] {
    const schemas: DatabaseSchema[] = [];

    for (const feature of prd.features) {
      if (feature.name.includes('数据') || feature.name.includes('Data')) {
        schemas.push({
          table: feature.name.toLowerCase(),
          fields: {
            id: 'uuid',
            created_at: 'timestamp',
            updated_at: 'timestamp',
          },
          indexes: ['id'],
          relationships: [],
        });
      }
    }

    return schemas;
  }

  /**
   * 生成测试计划
   */
  private generateTestingPlan(prd: PRDDocument): TestingPlan {
    const unitTests: string[] = [];
    const integrationTests: string[] = [];
    const e2eTests: string[] = [];

    for (const feature of prd.features) {
      unitTests.push(`${feature.name}单元测试`);
      integrationTests.push(`${feature.name}集成测试`);
      e2eTests.push(`${feature.name}端到端测试`);
    }

    return {
      unitTests: unitTests.length > 0 ? unitTests : ['基础功能单元测试'],
      integrationTests: integrationTests.length > 0 ? integrationTests : ['API集成测试'],
      e2eTests: e2eTests.length > 0 ? e2eTests : ['用户流程端到端测试'],
    };
  }

  /**
   * 生成部署计划
   */
  private generateDeploymentPlan(prd: PRDDocument): DeploymentPlan {
    return {
      environment: 'production',
      steps: [
        '构建应用',
        '运行测试',
        '部署到预发布环境',
        '执行冒烟测试',
        '部署到生产环境',
        '验证功能',
      ],
      rollback: [
        '回滚到上一个版本',
        '验证回滚成功',
      ],
    };
  }

  /**
   * 生成Markdown格式的开发文档
   */
  async generateMarkdown(devDoc: DevelopmentDocument): Promise<string> {
    const lines: string[] = [];

    lines.push(`# ${devDoc.title}`);
    lines.push(`\n版本: ${devDoc.version}\n`);
    lines.push(`## 概述\n\n${devDoc.overview}\n`);

    lines.push(`## 架构设计\n\n`);
    lines.push(`**架构模式**: ${devDoc.architecture.pattern}\n`);
    lines.push(`**架构层次**:\n`);
    for (const layer of devDoc.architecture.layers) {
      lines.push(`- ${layer}`);
    }
    lines.push(`\n**技术栈**:\n`);
    for (const tech of devDoc.architecture.technologies) {
      lines.push(`- ${tech}`);
    }

    lines.push(`\n## 模块设计\n\n`);
    for (const module of devDoc.modules) {
      lines.push(`### ${module.name}\n\n`);
      lines.push(`${module.description}\n\n`);
      lines.push(`**文件**:\n`);
      for (const file of module.files) {
        lines.push(`- ${file}`);
      }
      if (module.dependencies.length > 0) {
        lines.push(`\n**依赖**:\n`);
        for (const dep of module.dependencies) {
          lines.push(`- ${dep}`);
        }
      }
      lines.push(`\n`);
    }

    lines.push(`## API规范\n\n`);
    for (const api of devDoc.api) {
      lines.push(`### ${api.method} ${api.endpoint}\n\n`);
      lines.push(`${api.description}\n\n`);
      lines.push(`**请求**:\n\`\`\`json\n${JSON.stringify(api.request, null, 2)}\n\`\`\`\n\n`);
      lines.push(`**响应**:\n\`\`\`json\n${JSON.stringify(api.response, null, 2)}\n\`\`\`\n\n`);
    }

    lines.push(`## 数据库设计\n\n`);
    for (const schema of devDoc.database) {
      lines.push(`### ${schema.table}\n\n`);
      lines.push(`**字段**:\n`);
      for (const [field, type] of Object.entries(schema.fields)) {
        lines.push(`- ${field}: ${type}`);
      }
      if (schema.indexes.length > 0) {
        lines.push(`\n**索引**:\n`);
        for (const index of schema.indexes) {
          lines.push(`- ${index}`);
        }
      }
      lines.push(`\n`);
    }

    lines.push(`## 测试计划\n\n`);
    lines.push(`### 单元测试\n`);
    for (const test of devDoc.testing.unitTests) {
      lines.push(`- ${test}`);
    }
    lines.push(`\n### 集成测试\n`);
    for (const test of devDoc.testing.integrationTests) {
      lines.push(`- ${test}`);
    }
    lines.push(`\n### 端到端测试\n`);
    for (const test of devDoc.testing.e2eTests) {
      lines.push(`- ${test}`);
    }

    lines.push(`\n## 部署计划\n\n`);
    lines.push(`**环境**: ${devDoc.deployment.environment}\n\n`);
    lines.push(`**部署步骤**:\n`);
    for (const step of devDoc.deployment.steps) {
      lines.push(`${devDoc.deployment.steps.indexOf(step) + 1}. ${step}`);
    }
    lines.push(`\n**回滚步骤**:\n`);
    for (const step of devDoc.deployment.rollback) {
      lines.push(`- ${step}`);
    }

    return lines.join('\n');
  }
}

/**
 * 创建PlanModel实例的工厂函数
 */
export function createPlanModel(): PlanModel {
  return new PlanModel();
}

