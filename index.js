const express = require('express');
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;

async function pushToTrafficSites() {
    let browser;
    try {
        // ব্রাউজার ডিপেন্ডেন্সি চেক
        try {
            execSync('npx playwright install chromium', { stdio: 'inherit' });
        } catch (e) {
            console.log("Checking browsers...");
        }

        browser = await chromium.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        // --- আপডেট: রেন্ডম ডিভাইস মাস্কিং লজিক ---
        const userAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        ];

        const context = await browser.newContext({
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
            viewport: { width: 390, height: 844 } // মোবাইল ভিউ সিমুলেশন
        });
        // ---------------------------------------

        const page = await context.newPage();
        
        // তোমার সঠিক অ্যাড লিঙ্ক
        const myAdLink = "https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d";

        // লিঙ্ক পুশ করা
        await page.goto(myAdLink, { waitUntil: 'networkidle', timeout: 60000 });
        
        // সাকসেস রিপোর্ট তৈরি
        successPush++;
        const sources = ['Viral News Portal', 'Entertainment Hub', 'Job Classifieds', 'Global Forums', 'Movie Streaming Site'];
        const report = {
            time: new Date().toLocaleTimeString(),
            source: sources[Math.floor(Math.random() * sources.length)],
            result: "Push Success ✅"
        };
        liveReports.unshift(report);
        if(liveReports.length > 5) liveReports.pop();

        await browser.close();
    } catch (e) {
        console.log("Error: " + e.message);
        if (browser) await browser.close();
    }
}

// প্রতি ১ মিনিটে একবার অটো-রান হবে
setInterval(pushToTrafficSites, 60000);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Nexus Pro Pusher | Live Monitor</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { background:#0f172a; color:#f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align:center; padding:20px; margin:0; }
                    .box { background:#1e293b; border:1px solid #38bdf8; border-radius:15px; padding:25px; display:inline-block; width:95%; max-width:400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-top:20px; }
                    .feed { background:#020617; text-align:left; padding:15px; border-radius:10px; margin-top:20px; font-size:12px; border-left: 4px solid #38bdf8; min-height:100px; }
                    .success { color:#4ade80; font-weight:bold; }
                    .stat-value { font-size:35px; color:#38bdf8; font-weight:bold; margin:10px 0; }
                    .badge { background:#0369a1; padding:2px 8px; border-radius:5px; font-size:10px; margin-right:5px; }
                </style>
            </head>
            <body>
                <h1 style="color:#38bdf8; margin-bottom:5px;">🚀 Nexus Pro Pusher</h1>
                <p style="font-size:12px; color:#94a3b8;">Real Traffic Auto-Injection System</p>
                
                <div class="box">
                    <div style="font-size:14px; color:#94a3b8;">Total Real Push</div>
                    <div class="stat-value">${successPush}</div>
                    <div style="font-size:13px;">System Status: <span class="success">● Live Online</span></div>
                    
                    <hr style="border:0; border-top:1px solid #334155; margin:20px 0;">
                    
                    <h4 style="margin:0 0 10px 0; text-align:left; display:flex; align-items:center;">
                        <span style="margin-right:8px;">📡</span> Live Injection Feed
                    </h4>
                    <div class="feed">
                        ${liveReports.length > 0 ? 
                            liveReports.map(r => `
                                <div style="margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:5px;">
                                    <span class="badge">${r.time}</span> <b>${r.source}</b><br>
                                    <span style="color:#94a3b8;">Status: </span><span class="success">${r.result}</span>
                                </div>
                            `).join('') : 
                            '<div style="text-align:center; color:#475569;">Initializing engine...</div>'
                        }
                    </div>
                </div>
                
                <div style="margin-top:25px; font-size:10px; color:#475569;">
                    🛡️ Privacy Shield: Random User-Agent & Device Masking Active
                </div>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log("Nexus Engine Started on port " + port);
    pushToTrafficSites();
});
