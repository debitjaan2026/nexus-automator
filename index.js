const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let successPush = 0;
let liveReports = [];
let currentStatus = "Titan v7.1: Ready to Launch...";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a"
];

async function runGhostBrowser() {
    let browser;
    try {
        const link = myAdLinks[successPush % myAdLinks.length];
        currentStatus = "Igniting Ghost Browser (Low-RAM Mode)...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        // এই অংশটুকু আমি তোমার জন্য অপ্টিমাইজ করে দিয়েছি
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--disable-accelerated-2d-canvas', 
                '--no-first-run', 
                '--no-zygote', 
                '--single-process', 
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

        await page.setExtraHTTPHeaders({
            'Referer': 'https://www.google.com/'
        });

        currentStatus = "Searching Google... Masking Identity...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

        currentStatus = "Page Loaded. Ghost Session Active...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(r => setTimeout(r, 25000));

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), country: "Global High-CPM", source: "Titan-Engine", result: "Success ✅" });
        if(liveReports.length > 10) liveReports.pop();
        
        await browser.close();
        currentStatus = "Cooling Down... Stealth Mode 100%";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        if (browser) await browser.close();
        currentStatus = "System Lag Detected. Retrying...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

function engineLoop() {
    runGhostBrowser().then(() => {
        const nextInterval = Math.floor(Math.random() * (45000 - 20000 + 1) + 20000);
        setTimeout(engineLoop, nextInterval);
    });
}

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#0a0a0a; color:#00f7ff; font-family:monospace; text-align:center; padding:15px; } .container { border:2px solid #00f7ff; border-radius:15px; padding:20px; max-width:450px; display:inline-block; width:100%; box-shadow: 0 0 20px #00f7ff44; } .stat { font-size:60px; color:#fff; text-shadow: 0 0 10px #00f7ff; } .monitor { background:#111; padding:10px; margin:15px 0; border:1px solid #333; font-size:12px; color:#ff00ea; } .feed { background:#000; border-radius:5px; padding:10px; height:200px; overflow-y:auto; text-align:left; border:1px solid #00f7ff22; font-size:11px; }</style></head><body><div class="container"><h2>👻 TITAN GHOST v7.1</h2><div id="totalPush" class="stat">0</div><div class="monitor" id="statusBox">[SYSTEM]: Waiting...</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[SYSTEM]: " + data.currentStatus; let html = data.liveReports.map(r => `<div style="padding:5px; border-bottom:1px solid #111;">[${r.time}] ${r.result} - ${r.source}</div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { engineLoop(); });
