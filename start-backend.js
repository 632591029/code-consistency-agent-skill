#!/usr/bin/env node

// 加载环境变量
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 .env.local 文件
const envPath = join(__dirname, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');

// 解析并设置环境变量
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=');
      // 移除引号
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  }
});

// 启动服务器
import('./server.js');
