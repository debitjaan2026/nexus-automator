const express = require('express');
const { chromium } = require('playwright');
const app = express();

let trafficData = {
    total: 0
};

const TARGET_URL = 'https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d';

const referrers = [
    'https://www.google.com/',
    'https://www.facebook.com/',
    'https://twitter.com/',
    'https://www.reddit.com/',
    'https://www.bing.com/',
    'https://www.youtube.com/'
];

app.get('/', async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    const randomReferrer = referrers[Math.floor(Math.random() * referrers.length)];

    res.send(`
        <div style="font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #fff; padding: 20px; border-radius: 15px; max-width: 500px; margin: auto; border: 1px solid #4ecca3;">
            <h1 style="color: #4ecca3; text-align: center; font-size: 22px;">🛡️ Nexus Elite Monitor</h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                <div style="background: #16213e; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #4ecca3;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Total Traffic</p>
                    <h2 style="margin: 5px 0; color: #fff;">${trafficData.total}</h2>
                </div>
                <div style="background: #16213e; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #4ecca3;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Status</p>
                    <h2 style="margin: 5px 0; color: #4ecca3;">Live</h2>
                </div>
            </div>
            <div style="margin-top: 20px; background: #0f3460; padding: 15px; border-radius: 10px; font-size: 14px;">
                <h4 style="margin-top: 0; border-bottom: 1px solid #4ecca3; padding-bottom: 5px;">🔴 Real-time Details</h4>
                <p><strong>Current IP:</strong> <span style="color: #e94560;">${userIP}</span></p>
                <p><strong>Source:</strong> <span style="color: #4ecca3;">${randomReferrer}</span></p>
                <p><strong>Device:</strong> <span style="color: #fbd38d;">Chrome (Simulated)</span></p>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 15px;">ইঞ্জিন সচল। প্রতি রিফ্রেশে ১টি রিয়েল সোর্স ট্রাফিক যাবে।</p>
        </div>
    `);

    let browser;
    try {
        browser = await chromium.launch({ args: ['--no-sandbox'] });
        const context = await browser.newContext({
            userAgent: userAgent,
            extraHTTPHeaders: { 'Referer': randomReferrer }
        });
        const page = await context.newPage();
        await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
        trafficData.total++;
        await browser.close();
    } catch (e) {
        console.log("Error: " + e.message);
    }
});

app.listen(process.env.PORT || 3000);
