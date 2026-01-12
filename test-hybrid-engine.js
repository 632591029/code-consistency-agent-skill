#!/usr/bin/env node

// 加载环境变量
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=');
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  }
});

// 导入混合引擎
import { collectAndAnalyzeSignals } from './services/hybridSignalEngine.js';

console.log('开始测试混合信号引擎...\n');

try {
  const signals = await collectAndAnalyzeSignals();
  
  console.log('\n========================================');
  console.log('📊 测试结果');
  console.log('========================================\n');
  
  console.log(`总信号数: ${signals.length}\n`);
  
  console.log('前 5 条信号:\n');
  signals.slice(0, 5).forEach((s, i) => {
    console.log(`${i + 1}. ${s.title}`);
    console.log(`   类型: ${s.type} | 重要性: ${s.importance}/10`);
    console.log(`   来源: ${s.source}`);
    console.log(`   链接: ${s.originalUrl}`);
    console.log(`   摘要: ${s.summary.slice(0, 100)}...`);
    console.log(`   深度分析: ${s.meaning.slice(0, 100)}...`);
    console.log('');
  });
  
  console.log('✅ 测试成功！真实数据采集引擎工作正常。');
  
  // 保存到文件
  import('fs').then(fs => {
    fs.writeFileSync(
      '/home/ubuntu/lifeStart/test-signals-output.json',
      JSON.stringify(signals, null, 2)
    );
    console.log('\n完整数据已保存到 test-signals-output.json');
  });
  
} catch (error) {
  console.error('\n❌ 测试失败:', error);
  console.error(error.stack);
  process.exit(1);
}
