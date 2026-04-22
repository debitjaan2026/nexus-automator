const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let currentStatus = "Nexus Global: Ultra Targeted Mode";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a",
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743"
];

// ভাইরাল, অ্যাডাল্ট এবং মুভি সাইট মাস্কিং ডোমেইন লিস্ট
const massTrafficSources = [
    'https://www.pornhub.com/viral', 'https://www.xvideos.com/trending', 'https://www.fmovies.to/watch',
    'https://www.apkpure.com/games', 'https://www.nytimes.com/trending', 'https://www.reddit.com/r/viral',
    'https://www.tiktok.com/trending', 'https://www.instagram.com/explore', 'https://www.bbc.com/news/world',
    'https://www.apkshub.com/popular', 'https://www.1337x.to/trending', 'https://www.yts.mx/browse-movies'
];

const targetCountries = ['USA 🇺🇸', 'UK 🇬🇧', 'Canada 🇨🇦', 'France 🇫🇷', 'Germany 🇩🇪'];

async function runMasterNexus() {
    try {
        const link = myAdLinks[successPush % myAdLinks.length]; 
        const country = targetCountries[Math.floor(Math.random() * targetCountries.length)];
        const source = massTrafficSources[Math.floor(Math.random() * massTrafficSources.length)];

        // ১০ থেকে ৩০ সেকেন্ড র্যান্ডম ওয়েট (অ্যাডস্টারাকে রিয়েল ইউজার বোঝানোর জন্য)
        const waitTimes = [10000, 15000, 20000, 25000, 30000];
        const wait = waitTimes[Math.floor(Math.random() * waitTimes.length)];
        
        currentStatus = `Targeting ${country}... Masquing via ${source.split('/')[2]}... Waiting ${wait/1000}s`;
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        await new Promise(r => setTimeout(r, wait));

        // ট্রাফিক পুশ করা
        await axios.get(link, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': source 
            },
            timeout: 20000 
        });

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), country, source: source.split('/')[2], result: "Push Success ✅" });
        if(liveReports.length > 20) liveReports.pop();

        currentStatus = "Push Completed. Moving to next viral spot...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        currentStatus = "Stabilizing Connection...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

function engineLoop() {
    const nextInterval = Math.floor(Math.random() * (40000 - 20000 + 1) + 20000);
    runMasterNexus().then(() => setTimeout(engineLoop, nextInterval));
}

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#020617; color:#e2e8f0; font-family:sans-serif; text-align:center; padding:15px; } .container { background:#1e293b; border:2px solid #38bdf8; border-radius:20px; padding:20px; max-width:400px; display:inline-block; width:100%; box-shadow: 0 0 15px #38bdf833; } .stat { font-size:45px; color:#38bdf8; font-weight:bold; } .monitor { background:#000; border-radius:10px; padding:8px; margin:10px 0; color:#4ade80; font-family:monospace; font-size:12px; } .feed { background:#0f172a; border-radius:10px; padding:10px; margin-top:15px; text-align:left; font-size:11px; height:220px; overflow-y:auto; border:1px solid #334155; } .entry { border-bottom:1px solid #1e293b; padding:6px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2 style="color:#38bdf8; margin:0;">🚀 Nexus Ultimate v5.0</h2><div id="totalPush" class="stat">' + successPush + '</div><div class="monitor" id="statusBox">[STATUS]: ' + currentStatus + '</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[STATUS]: " + data.currentStatus; let html = data.liveReports.map(r => `<div class="entry"><span>[${r.time}] ${r.country} - ${r.source}</span><span style="color:#4ade80;">Success</span></div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { engineLoop(); });
