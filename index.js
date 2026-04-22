const express = require('express');
const { chromium } = require('playwright');
const app = express();
let totalHits = 0;
let history = [];

const TARGET_URL = 'https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d';
const sources = ['https://google.com', 'https://facebook.com', 'https://youtube.com', 'https://instagram.com'];

app.get('/', async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    res.send(`
        <div style="font-family:sans-serif; background:#0f172a; color:#fff; padding:15px; border-radius:12px; max-width:600px; margin:auto; border:1px solid #38bdf8;">
            <h2 style="color:#38bdf8; text-align:center;">🚀 Nexus Smart Monitor</h2>
            <div style="background:#1e293b; padding:10px; border-radius:8px; text-align:center; border-left:4px solid #38bdf8;">
                <small>Total Hits</small><br><strong style="font-size:24px;">${totalHits}</strong>
            </div>
            <div style="background:#1e293b; margin-top:15px; padding:15px; border-radius:8px; font-size:13px;">
                <p>🛰️ <b>Source:</b> ${randomSource}</p>
                <p>📱 <b>Device:</b> ${userAgent.includes('Mobi') ? 'Mobile' : 'Desktop'}</p>
                <p>🌐 <b>IP:</b> ${userIP}</p>
            </div>
            <h4 style="margin-top:20px; color:#94a3b8; border-bottom:1px solid #334155;">📋 History (Last 10)</h4>
            <div style="max-height:120px; overflow-y:auto; font-size:11px;">
                ${history.map(h => `<div style="padding:5px; border-bottom:1px solid #334155;">🕒 ${h.time} | 🔗 ${h.src}</div>`).join('')}
            </div>
        </div>
    `);

    try {
        const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const ctx = await browser.newContext({ userAgent: userAgent, extraHTTPHeaders: { 'Referer': randomSource } });
        const page = await ctx.newPage();
        await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
        totalHits++;
        history.unshift({ time: new Date().toLocaleTimeString(), src: randomSource });
        if(history.length > 10) history.pop();
        await browser.close();
    } catch (e) { console.log("Bot Error: " + e.message); }
});

app.listen(process.env.PORT || 3000);
