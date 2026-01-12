import express from 'express';
import cors from 'cors';
import { collectAndAnalyzeSignals } from './services/hybridSignalEngine.js';
import { sendEmail } from './services/emailService.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 认证中间件
const CRON_AUTH_TOKEN = process.env.CRON_AUTH_TOKEN || 'alpha_secure_trigger_2025';

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== CRON_AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        engine: 'hybrid-real-data',
        version: '2.0'
    });
});

// 扫描接口
app.post('/api/cron/scan', authMiddleware, async (req, res) => {
    console.log(`\n[${new Date().toISOString()}] 📡 收到扫描请求`);
    
    try {
        const preferences = req.body.preferences || process.env.SCAN_PREFERENCES || 
            "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source";
        
        // 执行混合信号采集
        const signals = await collectAndAnalyzeSignals(preferences);
        
        res.json({
            status: 'success',
            engine: 'hybrid-real-data',
            count: signals.length,
            signals,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ 扫描失败:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// 扫描并发送邮件
app.post('/api/cron/scan-and-email', authMiddleware, async (req, res) => {
    console.log(`\n[${new Date().toISOString()}] 📧 收到扫描并发送邮件请求`);
    
    try {
        const preferences = req.body.preferences || process.env.SCAN_PREFERENCES || 
            "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source";
        
        const userEmail = process.env.USER_EMAIL || 'a632591029@gmail.com';
        
        // 执行混合信号采集
        const signals = await collectAndAnalyzeSignals(preferences);
        
        // 发送邮件
        const emailResult = await sendEmail(userEmail, signals);
        
        res.json({
            status: 'success',
            engine: 'hybrid-real-data',
            signalCount: signals.length,
            emailSent: emailResult.success,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ 扫描并发送邮件失败:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 ALPHA Signal Hub v2.0 启动成功`);
    console.log(`   - 端口: ${PORT}`);
    console.log(`   - 引擎: 混合真实数据引擎`);
    console.log(`   - 数据源: GitHub, HackerNews, Reddit, CoinGecko, Twitter`);
    console.log(`   - 时间: ${new Date().toISOString()}`);
    console.log(`========================================\n`);
});
