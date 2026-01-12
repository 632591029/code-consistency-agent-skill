import { generateMockSignals } from './services/mockSignals.js';

console.log('测试模拟数据生成器...\n');

const signals = generateMockSignals();

console.log(`✅ 生成了 ${signals.length} 条模拟信号\n`);

signals.slice(0, 3).forEach((s, i) => {
  console.log(`${i + 1}. ${s.title}`);
  console.log(`   类型: ${s.type} | 重要性: ${s.importance}/10`);
  console.log(`   摘要: ${s.summary.slice(0, 80)}...`);
  console.log('');
});

console.log('✅ 模拟数据功能正常！');
