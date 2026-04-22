const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let currentStatus = "Nexus Engine Active ✅";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743"
];

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.40 Mobile Safari/537.36'
];

async function runNexus() {
    try {
        const targetLink = myAdLinks[Math.floor(Math.random() * myAdLinks.length)];
        const sources = ['Google Search', 'Facebook Viral', 'Reddit Trend', 'Twitter Feed'];
        const selectedSource = sources[Math.floor(Math.random() * sources.length)];
        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

        currentStatus = "Injecting High Quality Traffic...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        // সরাসরি রিকোয়েস্ট পাঠিয়ে সেশন ধরে রাখা
        await axios.get(targetLink, {
            headers: { 
                'User-Agent': randomUA,
                'Referer': 'https://www.facebook.com/'
            },
            timeout: 20000 
        });

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), source: selectedSource, result: "Success ✅" });
        if(liveReports.length > 20) liveReports.pop();

        currentStatus = "Waiting for Next Session...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        currentStatus = "Session Stabilizing...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

// প্রতি ৩০ সেকেন্ড পর পর চলবে
setInterval(runNexus, 30000);

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#020617; color:#e2e8f0; font-family:sans-serif; text-align:center; padding:15px; } .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:400px; display:inline-block; width:100%; box-shadow: 0 0 15px #38bdf833; } .stat { font-size:45px; color:#38bdf8; font-weight:bold; } .monitor { background:#000; border-radius:10px; padding:8px; margin:10px 0; color:#4ade80; font-family:monospace; font-size:12px; } .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:15px; text-align:left; font-size:11px; height:200px; overflow-y:auto; border:1px solid #334155; } .entry { border-bottom:1px solid #1e293b; padding:6px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2 style="color:#38bdf8; margin:0;">🚀 Nexus Pro v4.0</h2><div id="totalPush" class="stat">' + successPush + '</div><div class="monitor" id="statusBox">[STATUS]: ' + currentStatus + '</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[STATUS]: " + data.currentStatus; let html = data.liveReports.map(r => `<div class="entry"><span>[${r.time}] ${r.source}</span><span style="color:#4ade80;">${r.result}</span></div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { runNexus(); });
