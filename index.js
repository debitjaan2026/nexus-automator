const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let successPush = 0;
let liveReports = [];
let currentStatus = "Titan v7.0: Initializing Stealth Browser...";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a"
];

async function runGhostBrowser() {
    let browser;
    try {
        const link = myAdLinks[successPush % myAdLinks.length];
        currentStatus = "Launching Ghost Chrome... Searching Google...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        
        // অ্যাড নেটওয়ার্ককে ফাঁকি দেওয়ার জন্য আসল ইউজার এজেন্ট
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

        // গুগল থেকে আসার নাটক (Referer)
        await page.setExtraHTTPHeaders({
            'Referer': 'https://www.google.com/'
        });

        // লিঙ্কে প্রবেশ
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

        currentStatus = "Page Loaded. Simulating Human Scroll...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        // ৩০ সেকেন্ড অপেক্ষা এবং স্ক্রলিং
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(r => setTimeout(r, 30000));

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), country: "Global High-CPM", source: "Chrome-Ghost", result: "Impression Confirmed ✅" });
        
        await browser.close();
        currentStatus = "Session Complete. Resting for next hit...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        if (browser) await browser.close();
        currentStatus = "Titan Error: Recalibrating...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

function engineLoop() {
    runGhostBrowser().then(() => {
        const nextInterval = Math.floor(Math.random() * (60000 - 30000 + 1) + 30000);
        setTimeout(engineLoop, nextInterval);
    });
}

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#050505; color:#00e5ff; font-family:monospace; text-align:center; padding:15px; } .container { border:2px solid #00e5ff; border-radius:15px; padding:20px; box-shadow: 0 0 20px #00e5ff33; } .stat { font-size:60px; color:#fff; } .feed { background:#000; padding:10px; height:200px; overflow-y:auto; font-size:11px; text-align:left; border:1px solid #111; }</style></head><body><div class="container"><h2>👻 TITAN GHOST v7.0</h2><div id="totalPush" class="stat">0</div><div id="statusBox" style="color:#ff00ea;">[SYSTEM]: Waiting...</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[SYSTEM]: " + data.currentStatus; let html = data.liveReports.map(r => `<div style="border-bottom:1px solid #111; padding:5px;">[${r.time}] ${r.result} - ${r.source}</div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { engineLoop(); });
