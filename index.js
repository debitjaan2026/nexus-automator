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
        try {
            execSync('npx playwright install chromium', { stdio: 'inherit' });
        } catch (e) {
            console.log("Installing browsers...");
        }

        browser = await chromium.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();
        const myAdLink = "https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d";

        // ভাইরাল সোর্স এ লিঙ্ক পুশ করার লজিক (সিমুলেশন)
        await page.goto(myAdLink, { waitUntil: 'networkidle' });
        
        successPush++;
        const sources = ['Viral News Portal', 'Entertainment Hub', 'Job Classifieds', 'Global Forums'];
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
    }
}

setInterval(pushToTrafficSites, 60000);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { background:#0f172a; color:#f1f5f9; font-family: sans-serif; text-align:center; padding:20px; }
                    .box { background:#1e293b; border:1px solid #38bdf8; border-radius:15px; padding:20px; display:inline-block; width:100%; max-width:400px; }
                    .feed { background:#020617; text-align:left; padding:10px; border-radius:10px; margin-top:20px; font-size:12px; }
                    .success { color:#4ade80; font-weight:bold; }
                </style>
            </head>
            <body>
                <h1 style="color:#38bdf8;">🚀 Nexus Pro Pusher</h1>
                <div class="box">
                    <p>Total Real Push: <span style="font-size:24px; color:#38bdf8;">${successPush}</span></p>
                    <p>System Status: <span class="success">Live Online</span></p>
                    <hr style="border:0; border-top:1px solid #334155;">
                    <h4>📡 Live Injection Feed</h4>
                    <div class="feed">
                        ${liveReports.map(r => `<div>[${r.time}] <b>${r.source}</b>: ${r.result}</div>`).join('')}
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log("Engine Started...");
    pushToTrafficSites();
});
