#!/usr/bin/env node

/**
 * ALPHA Signal Hub - 每日信号采集任务
 * 
 * 功能：
 * 1. 从真实数据源采集最新技术信号
 * 2. 使用 AI 进行深度分析
 * 3. 发送邮件到用户邮箱
 */

import { collectAndAnalyzeSignals } from './services/hybridSignalEngine.js';
import { sendEmail } from './services/emailService.js';

// 配置
const USER_EMAIL = 'a632591029@gmail.com';
const SCAN_PREFERENCES = 'AI Productivity, Web3 Infrastructure, GPU Markets, Open Source';

async function runDailyTask() {
  console.log('\n========================================');
  console.log('🚀 ALPHA Signal Hub - 每日信号采集任务');
  console.log(`⏰ 执行时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('========================================\n');
  
  try {
    // Step 1: 采集和分析信号
    console.log('【步骤 1/2】采集真实数据并进行 AI 分析...\n');
    const signals = await collectAndAnalyzeSignals(SCAN_PREFERENCES);
    
    if (signals.length === 0) {
      console.log('⚠️  未采集到任何信号，跳过邮件发送');
      return;
    }
    
    console.log(`✅ 采集完成：共 ${signals.length} 条高质量信号\n`);
    
    // Step 2: 发送邮件
    console.log('【步骤 2/2】发送邮件简报...\n');
    const emailResult = await sendEmail(USER_EMAIL, signals);
    
    if (emailResult.success) {
      console.log(`✅ 邮件发送成功！已发送到 ${USER_EMAIL}`);
    } else {
      console.log(`❌ 邮件发送失败: ${emailResult.error}`);
    }
    
    console.log('\n========================================');
    console.log('✅ 每日任务执行完成！');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('\n❌ 任务执行失败:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// 执行任务
runDailyTask();
