const express = require('express');
const { chromium } = require('playwright');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let currentStatus = "System Ready - Starting...";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743"
];

async function runNexus() {
    let browser;
    try {
        currentStatus = "Connecting Engine...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        // সুপার লাইটওয়েট লঞ্চ
        browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        
        const targetLink = myAdLinks[Math.floor(Math.random() * myAdLinks.length)];
        const sources = ['Google Search', 'Facebook Viral', 'Reddit Trend', 'Twitter Feed'];
        const selectedSource = sources[Math.floor(Math.random() * sources.length)];
        
        currentStatus = "Injecting...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        // লোড হওয়ার জন্য কম সময় (ফাস্ট কাজ করবে)
        await page.goto(targetLink, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // সিম্পল স্ক্রল
        await page.evaluate(() => window.scrollBy(0, 300));
        await new Promise(r => setTimeout(r, 3000)); 

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), source: selectedSource, result: "Success ✅" });
        if(liveReports.length > 20) liveReports.pop();

        currentStatus = "Task Finished!";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
        
        await browser.close();
    } catch (e) {
        if (browser) await browser.close();
        currentStatus = "Retrying...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

// প্রতি ৪০ সেকেন্ড পর পর কাজ করবে
setInterval(runNexus, 40000);

app.get('/', (req, res) => {
    res.send(`<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#020617; color:#e2e8f0; font-family:sans-serif; text-align:center; padding:15px; } .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:400px; display:inline-block; width:100%; box-shadow: 0 0 15px #38bdf833; } .stat { font-size:45px; color:#38bdf8; font-weight:bold; } .monitor { background:#000; border-radius:10px; padding:8px; margin:10px 0; color:#4ade80; font-family:monospace; font-size:12px; } .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:15px; text-align:left; font-size:11px; height:200px; overflow-y:auto; border:1px solid #334155; } .entry { border-bottom:1px solid #1e293b; padding:6px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2 style="color:#38bdf8; margin:0;">🚀 Nexus Pro v3.3</h2><div id="totalPush" class="stat">\${successPush}</div><div class="monitor" id="statusBox">[STATUS]: \${currentStatus}</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[STATUS]: " + data.currentStatus; let html = data.liveReports.map(r => '<div class="entry"><span>['+r.time+'] '+r.source+'</span><span style="color:#4ade80;">'+r.result+'</span></div>').join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>`);
});

http.listen(port, () => { runNexus(); });
