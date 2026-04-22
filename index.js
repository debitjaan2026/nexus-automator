const express = require('express');
const { chromium } = require('playwright');
const axios = require('axios');
const app = express();

let totalHits = 0;
let history = []; // এখানে আগের ডাটা জমা থাকবে

const TARGET_URL = 'https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d';
const sources = ['https://google.com', 'https://facebook.com', 'https://youtube.com', 'https://instagram.com'];

app.get('/', async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    // কান্ট্রি চেক করার জন্য API
    let country = "Checking...";
    try {
        const geo = await axios.get(`https://ipapi.co/${userIP.split(',')[0]}/json/`);
        country = geo.data.country_name || "Unknown";
    } catch (e) { country = "Detecting..."; }

    // ড্যাশবোর্ড ডিজাইন
    res.send(`
        <div style="font-family:sans-serif; background:#0f172a; color:#fff; padding:15px; border-radius:12px; max-width:600px; margin:auto;">
            <h2 style="color:#38bdf8; text-align:center;">🚀 Nexus Ultimate Monitor</h2>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div style="background:#1e293b; padding:10px; border-radius:8px; border-left:4px solid #38bdf8;">
                    <small>Total Hits</small><br><strong>${totalHits}</strong>
                </div>
                <div style="background:#1e293b; padding:10px; border-radius:8px; border-left:4px solid #fbbf24;">
                    <small>Current Country</small><br><strong>${country}</strong>
                </div>
            </div>

            <div style="background:#1e293b; margin-top:15px; padding:15px; border-radius:8px; font-size:13px;">
                <p>🛰️ <b>Current Source:</b> ${randomSource}</p>
                <p>📱 <b>Device:</b> ${userAgent.includes('Mobi') ? 'Mobile' : 'Desktop'}</p>
                <p>🌐 <b>IP:</b> ${userIP}</p>
            </div>

            <h4 style="margin-top:20px; color:#94a3b8; border-bottom:1px solid #334155;">📋 Previous Traffic History</h4>
            <div style="max-height:150px; overflow-y:auto; font-size:11px;">
                ${history.map(h => `<div style="padding:5px; border-bottom:1px solid #334155;">🌍 ${h.country} | 🕒 ${h.time} | 🔗 ${h.src}</div>`).join('')}
            </div>
        </div>
    `);

    // ব্যাকএন্ডে ব্রাউজার রান করা (ট্রাফিক পাঠানোর আসল কাজ)
    let browser;
    try {
        browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const ctx = await browser.newContext({ userAgent: userAgent, extraHTTPHeaders: { 'Referer': randomSource } });
        const page = await ctx.newPage();
        await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
        
        totalHits++;
        // হিস্টোরিতে ডাটা যোগ করা
        history.unshift({ country: country, time: new Date().toLocaleTimeString(), src: randomSource });
        if(history.length > 10) history.pop(); // ১০টার বেশি হলে পুরানোটা মুছে যাবে

        await browser.close();
    } catch (e) { console.log("Bot Error: " + e.message); }
});

app.listen(process.env.PORT || 3000);
