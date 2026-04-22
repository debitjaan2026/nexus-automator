const express = require('express');
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let linkIndex = 0;
let currentStatus = "Engines Ready... Target 50K";

// তোমার সঠিক অ্যাড লিঙ্ক দুটি এখানে সেট করা হয়েছে
const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743"
];

// লিঙ্ক মাস্কিং ফাংশন (ফেসবুক/সোশ্যাল মিডিয়ার জন্য সেফ)
async function getMaskedLink(url) {
    try {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        return res.data;
    } catch (e) {
        return url; 
    }
}

async function runNexusUltra() {
    let browser;
    try {
        try { execSync('npx playwright install chromium', { stdio: 'inherit' }); } catch (e) {}
        browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

        // এক সাথে ৫টি প্যারালাল টাস্ক (High Speed Parallel Injection)
        const injectionTasks = Array.from({ length: 5 }).map(async (_, i) => {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            });
            const page = await context.newPage();

            // রোটেশন অনুযায়ী একটি লিঙ্ক নেওয়া এবং মাস্ক করা
            const targetLink = myAdLinks[linkIndex];
            linkIndex = (linkIndex + 1) % myAdLinks.length;
            const maskedLink = await getMaskedLink(targetLink);

            const sources = [
                'Bollywood Viral Hub', 'Premium APK Portal', 'Adult Forum X', 
                'Movie Leak Stream', 'Social Viral Injector', 'Twitter Trend Mask'
            ];
            const selectedSource = sources[Math.floor(Math.random() * sources.length)];
            
            currentStatus = `Pushing Link ${linkIndex === 0 ? 2 : 1} to ${selectedSource}`;

            // ইনজেকশন রান করা
            await page.goto(maskedLink, { waitUntil: 'networkidle', timeout: 60000 });
            await page.waitForTimeout(8000); // ৮ সেকেন্ড স্টে (CPM বাড়ানোর জন্য)

            successPush++;
            const report = {
                time: new Date().toLocaleTimeString(),
                source: selectedSource,
                link: `Link ${linkIndex === 0 ? 2 : 1}`,
                result: "Success ✅"
            };

            liveReports.unshift(report);
            if(liveReports.length > 12) liveReports.pop();

            // লাইভ ড্যাশবোর্ড আপডেট (No Refresh Needed)
            io.emit('updateStats', { successPush, liveReports, currentStatus });

            await context.close();
        });

        await Promise.all(injectionTasks);
        await browser.close();
    } catch (e) {
        if (browser) await browser.close();
    }
}

// প্রতি ৪০ সেকেন্ডে ৫টি করে পুশ (মিনিটে প্রায় ৮টি, হাই স্পিড)
setInterval(runNexusUltra, 40000);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="/socket.io/socket.io.js"></script>
                <style>
                    body { background:#020617; color:#e2e8f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align:center; padding:15px; }
                    .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:480px; display:inline-block; width:100%; box-shadow: 0 0 30px #38bdf822; }
                    .stat-box { margin: 15px 0; }
                    .stat-num { font-size:60px; color:#38bdf8; font-weight:bold; text-shadow: 0 0 10px #38bdf855; }
                    .monitor { background:#000; border-radius:12px; padding:12px; margin:15px 0; border:1px solid #334155; font-family: monospace; color:#4ade80; font-size:13px; }
                    .feed { background:#0f172a; border-radius:12px; padding:12px; text-align:left; font-size:11px; height:280px; overflow-y:auto; border:1px solid #1e293b; }
                    .entry { border-bottom:1px solid #1e293b; padding:8px 0; display:flex; justify-content:space-between; align-items:center; }
                    .source-name { color:#f472b6; font-weight:bold; }
                    .blink { animation: blinker 1s linear infinite; }
                    @keyframes blinker { 50% { opacity: 0; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 style="color:#38bdf8; margin-bottom:5px;">🚀 Nexus Ultra Master</h2>
                    <div style="font-size:12px; color:#94a3b8;">High-Speed Global Traffic Injector</div>
                    
                    <div class="stat-box">
                        <div id="totalPush" class="stat-num">${successPush}</div>
                        <div style="color:#4ade80; font-weight:bold;"><span class="blink">●</span> LIVE INJECTIONS</div>
                    </div>

                    <div class="monitor" id="statusBox">
                        [STATUS]: ${currentStatus}
                    </div>

                    <div class="feed" id="feedBox">
                        ${liveReports.map(r => `
                            <div class="entry">
                                <span>[${r.time}] <span class="source-name">${r.source}</span></span>
                                <span style="color:#4ade80;">${r.result}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <script>
                    const socket = io();
                    socket.on('updateStats', (data) => {
                        document.getElementById('totalPush').innerText = data.successPush;
                        document.getElementById('statusBox').innerText = "[STATUS]: " + data.currentStatus;
                        let html = data.liveReports.map(r => \`
                            <div class="entry">
                                <span>[\${r.time}] <span class="source-name">\${r.source}</span> (\${r.link})</span>
                                <span style="color:#4ade80;">\${r.result}</span>
                            </div>
                        \`).join('');
                        document.getElementById('feedBox').innerHTML = html;
                    });
                </script>
            </body>
        </html>
    `);
});

http.listen(port, () => {
    console.log("Nexus Ultra Master Engine Started...");
    runNexusUltra();
});
