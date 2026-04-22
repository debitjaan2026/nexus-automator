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
let currentStatus = "Optimizing Engine for Stability...";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743"
];

async function getMaskedLink(url) {
    try {
        const res = await axios.get("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url), { timeout: 5000 });
        return res.data;
    } catch (e) { return url; }
}

async function runNexusUltra() {
    let browser;
    try {
        try { execSync('npx playwright install chromium', { stdio: 'inherit' }); } catch (e) {}
        browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });

        const injectionTasks = Array.from({ length: 3 }).map(async (_, i) => {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            });
            const page = await context.newPage();
            const targetLink = myAdLinks[linkIndex];
            linkIndex = (linkIndex + 1) % myAdLinks.length;
            const maskedLink = await getMaskedLink(targetLink);

            const sources = ['Global Movie Stream', 'Viral APK Hub', 'Social Injector', 'Twitter Trend Mask'];
            const selectedSource = sources[Math.floor(Math.random() * sources.length)];
            currentStatus = "Injecting Link " + (linkIndex === 0 ? 2 : 1) + "...";

            await page.goto(maskedLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForTimeout(8000); 

            successPush++;
            const report = { time: new Date().toLocaleTimeString(), source: selectedSource, result: "Success ✅" };
            liveReports.unshift(report);
            if(liveReports.length > 10) liveReports.pop();

            io.emit('updateStats', { successPush, liveReports, currentStatus });
            await context.close();
        });

        await Promise.all(injectionTasks);
        await browser.close();
    } catch (e) {
        if (browser) await browser.close();
        currentStatus = "Engine Cooling Down...";
    }
}

setInterval(runNexusUltra, 50000);

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#020617; color:#e2e8f0; font-family: sans-serif; text-align:center; padding:15px; } .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:450px; display:inline-block; width:100%; box-shadow: 0 0 20px #38bdf833; } .stat { font-size:50px; color:#38bdf8; font-weight:bold; } .monitor { background:#000; border-radius:10px; padding:10px; margin:15px 0; color:#4ade80; font-family:monospace; font-size:12px; } .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:20px; text-align:left; font-size:11px; height:220px; overflow-y:auto; } .entry { border-bottom:1px solid #1e293b; padding:8px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2 style="color:#38bdf8; margin:0;">🚀 Nexus Stable v2</h2><div id="totalPush" class="stat">' + successPush + '</div><div class="monitor" id="statusBox">[STATUS]: ' + currentStatus + '</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[STATUS]: " + data.currentStatus; let html = data.liveReports.map(r => `<div class="entry"><span>[${r.time}] ${r.source}</span><span style="color:#4ade80;">${r.result}</span></div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => {
    console.log("Nexus Stable Engine Started...");
    runNexusUltra();
});
