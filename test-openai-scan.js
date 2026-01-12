import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
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

// 导入并测试 OpenAI 扫描引擎
import { performOpenAIScan } from './services/openaiScanEngine.js';

console.log('开始测试 OpenAI 扫描引擎...\n');

performOpenAIScan('AI Productivity, Web3')
  .then(signals => {
    console.log(`\n✅ 扫描成功！获取到 ${signals.length} 条信号\n`);
    console.log('前 3 条信号预览：');
    signals.slice(0, 3).forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.title}`);
      console.log(`   类型: ${s.type} | 重要性: ${s.importance}/10`);
      console.log(`   摘要: ${s.summary.slice(0, 100)}...`);
    });
    
    // 保存到文件供后续使用
    import('fs').then(fs => {
      fs.writeFileSync(
        '/home/ubuntu/lifeStart/test-signals.json',
        JSON.stringify(signals, null, 2)
      );
      console.log('\n✅ 信号数据已保存到 test-signals.json');
    });
  })
  .catch(error => {
    console.error('❌ 扫描失败:', error.message);
    process.exit(1);
  });
