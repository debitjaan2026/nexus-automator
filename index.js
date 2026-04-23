const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let successPush = 0;
let liveReports = [];
let currentStatus = "Titan v7.2: Ultra-Light Masking Active";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a"
];

const keywords = ["trending tech 2026", "how to earn crypto", "best gaming laptops", "viral news today"];

async function runUltraLightEngine() {
    try {
        const link = myAdLinks[successPush % myAdLinks.length];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        currentStatus = `Searching Google for: "${keyword}"...`;
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        await axios.get(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
                'Origin': 'https://www.google.com',
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 15000
        });

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), source: "Google Organic", result: "Titan Success ✅" });
        if(liveReports.length > 10) liveReports.pop();
        
        currentStatus = "Stealth Hit Complete. Preparing next search...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        currentStatus = "Network Busy. Re-searching...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

function engineLoop() {
    const delay = Math.floor(Math.random() * (40000 - 20000 + 1) + 20000);
    runUltraLightEngine().then(() => setTimeout(engineLoop, delay));
}

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#0a0a0a; color:#00ff9d; font-family:monospace; text-align:center; padding:15px; } .container { border:2px solid #00ff9d; border-radius:15px; padding:20px; box-shadow: 0 0 20px #00ff9d44; } .stat { font-size:60px; color:#fff; text-shadow: 0 0 10px #00ff9d; }</style></head><body><div class="container"><h2>⚡ TITAN v7.2</h2><div id="totalPush" class="stat">0</div><div id="statusBox" style="color:#ff00ea;">[SYSTEM]: Booting...</div><div id="feedBox" style="font-size:11px; text-align:left; margin-top:15px;"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[SYSTEM]: " + data.currentStatus; let html = data.liveReports.map(r => `<div>[${r.time}] ${r.result} - ${r.source}</div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { engineLoop(); });
