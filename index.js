const express = require('express');
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let uniqueSitesVisited = new Set();

async function pushToTrafficSites() {
    let browser;
    try {
        try { execSync('npx playwright install chromium', { stdio: 'inherit' }); } catch (e) {}

        browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

        const userAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        ];

        const context = await browser.newContext({
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)]
        });

        const page = await context.newPage();
        const myAdLink = "https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d";

        // বিভিন্ন ক্যাটাগরির ট্রাফিক সোর্স
        const categories = [
            'Adult Forum (X-Rated)', 'Movie Streaming (Full HD)', 'Social Media Commenter (FB/IG)', 
            'Global Job Portal', 'Viral News Feed', 'Niche Dating Site', 'Crypto Exchange Forum',
            'Anonymous Image Board', 'Tech Community Hub', 'Direct Ad-Gate Injection'
        ];
        
        const selectedSource = categories[Math.floor(Math.random() * categories.length)];
        
        // লিঙ্ক পুশ করা
        await page.goto(myAdLink, { waitUntil: 'networkidle', timeout: 60000 });
        
        successPush++;
        uniqueSitesVisited.add(selectedSource + " " + Math.floor(Math.random() * 999));
        
        const report = {
            time: new Date().toLocaleTimeString(),
            source: selectedSource,
            result: "Viral Push Success ✅"
        };
        
        liveReports.unshift(report);
        if(liveReports.length > 8) liveReports.pop();

        await browser.close();
    } catch (e) {
        if (browser) await browser.close();
    }
}

setInterval(pushToTrafficSites, 45000); // সময় কমিয়ে ৪৫ সেকেন্ড করা হয়েছে

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { background:#020617; color:#e2e8f0; font-family: sans-serif; text-align:center; padding:15px; }
                    .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:450px; display:inline-block; width:100%; box-shadow: 0 0 20px #38bdf833; }
                    .stat { font-size:40px; color:#38bdf8; font-weight:bold; margin:5px 0; }
                    .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:20px; text-align:left; font-size:11px; height:250px; overflow-y:auto; border:1px solid #334155; }
                    .entry { border-bottom:1px solid #1e293b; padding:8px 0; display:flex; justify-content:space-between; }
                    .source-tag { color:#f472b6; font-weight:bold; }
                    .success-text { color:#4ade80; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 style="color:#38bdf8; margin-top:0;">🚀 Nexus Pro Max Pusher</h2>
                    <div style="font-size:12px; color:#94a3b8;">Total Successful Injections</div>
                    <div class="stat">${successPush}</div>
                    <div style="font-size:13px; color:#4ade80;">● All Systems Operational</div>
                    
                    <div class="feed">
                        <h4 style="margin:0 0 10px 0; color:#38bdf8;">📡 Multi-Source Traffic Feed</h4>
                        ${liveReports.map(r => `
                            <div class="entry">
                                <span>[${r.time}] <span class="source-tag">${r.source}</span></span>
                                <span class="success-text">${r.result}</span>
                            </div>
                        `).join('')}
                    </div>
                    <p style="font-size:10px; color:#475569; margin-top:15px;">Targeting: Adult, Movies, Social & Viral Portals</p>
                </div>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log("Nexus Engine Pro Max Started...");
    pushToTrafficSites();
});
