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
let currentStatus = "Nexus Pro Engine Primed...";

// তোমার আগের লিঙ্ক দুটো এখানে সুরক্ষিত আছে
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

        // একসাথে ৩টি টাস্ক চলবে
        const injectionTasks = Array.from({ length: 3 }).map(async (_, i) => {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            });
            const page = await context.newPage();
            const targetLink = myAdLinks[linkIndex];
            linkIndex = (linkIndex + 1) % myAdLinks.length;
            const maskedLink = await getMaskedLink(targetLink);

            const sources = ['Google Organic Search', 'Facebook Viral Post', 'Reddit Community', 'Twitter Global Feed', 'Pinterest News'];
            const selectedSource = sources[Math.floor(Math.random() * sources.length)];
            currentStatus = "Injecting High-CPM Traffic...";

            await page.goto(maskedLink, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // --- AI Human Behavior: Scrolling ---
            await page.evaluate(async () => {
                for (let j = 0; j < 4; j++) {
                    window.scrollBy(0, 350);
                    await new Promise(r => setTimeout(r, 2000));
                }
            });
            
            await page.waitForTimeout(7000); // পেজে আরও ৭ সেকেন্ড অবস্থান

            successPush++;
            const report = { time: new Date().toLocaleTimeString(), source: selectedSource, result: "Success ✅" };
            liveReports.unshift(report);
            if(liveReports.length > 50) liveReports.pop(); // ফিডে ৫০টি রিপোর্ট দেখাবে

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

// প্রতি ৪৫ সেকেন্ড পর পর ইঞ্জিন রান করবে
setInterval(runNexusUltra, 45000);

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#020617; color:#e2e8f0; font-family: sans-serif; text-align:center; padding:15px; } .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:450px; display:inline-block; width:100%; box-shadow: 0 0 20px #38bdf833; } .stat { font-size:50px; color:#38bdf8; font-weight:bold; } .monitor { background:#000; border-radius:10px; padding:10px; margin:15px 0; color:#4ade80; font-family:monospace; font-size:12px; } .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:20px; text-align:left; font-size:11px; height:250px; overflow-y:scroll; border: 1px solid #334155; } .entry { border-bottom:1px solid #1e293b; padding:8px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2 style="color:#38bdf8; margin:0;">🚀 Nexus Pro v3</h2><div id="totalPush" class="stat">' + successPush + '</div><div class="monitor" id="statusBox">[STATUS]: ' + currentStatus + '</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[STATUS]: " + data.currentStatus; let html = data.liveReports.map(r => `<div class="entry"><span>[${r.time}] ${r.source}</span><span style="color:#4ade80;">${r.result}</span></div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => {
    console.log("Nexus Pro Engine Started...");
    runNexusUltra();
});
