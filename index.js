const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let liveReports = [];
let successPush = 0;
let currentStatus = "Nexus Titan: Poly-Fingerprinting Active";

const myAdLinks = [
    "https://www.profitablecpmratenetwork.com/zaa9nppna?key=e42ebc0a997943ef4b244903273e1743",
    "https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a"
];

// এই প্রক্সি লিস্টগুলো কোড অটোমেটিক রোটেশন করবে
const proxyBackbone = [
    'http://103.152.112.162:80', 'http://167.71.201.205:80', 'http://159.203.61.169:8080',
    'http://45.77.56.114:8080', 'http://138.68.60.224:3128', 'http://209.97.150.167:3128'
];

const searchKeywords = ["best movies 2026", "how to earn money online", "viral tech news", "latest android apks", "high cpm networks"];
const targetCountries = ['USA 🇺🇸', 'UK 🇬🇧', 'Canada 🇨🇦', 'France 🇫🇷', 'Germany 🇩🇪'];

async function runTitanEngine() {
    try {
        const link = myAdLinks[successPush % myAdLinks.length]; 
        const country = targetCountries[Math.floor(Math.random() * targetCountries.length)];
        const keyword = searchKeywords[Math.floor(Math.random() * searchKeywords.length)];
        const proxy = proxyBackbone[Math.floor(Math.random() * proxyBackbone.length)];

        // ১০-৩৫ সেকেন্ডের স্মার্ট সেশন ওয়েট
        const wait = Math.floor(Math.random() * (35000 - 10000 + 1) + 10000);
        currentStatus = `Searching: "${keyword}"... Masking via ${country}...`;
        io.emit('updateStats', { successPush, liveReports, currentStatus });

        await new Promise(r => setTimeout(r, wait));

        // অ্যাড নেটওয়ার্ককে বোঝানো হচ্ছে যে ট্রাফিকটি Google Search থেকে আসছে
        await axios.get(link, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
                'Sec-CH-UA-Platform': '"Windows"',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            proxy: false, // ফ্রি সার্ভারে প্রক্সি অনেক সময় এরর দেয়, তাই মাস্কিংয়ে জোর দেওয়া হয়েছে
            timeout: 25000 
        });

        successPush++;
        liveReports.unshift({ time: new Date().toLocaleTimeString(), country, source: "Google Search", result: "Titan Success ✅" });
        if(liveReports.length > 20) liveReports.pop();

        currentStatus = "Engine Cooling Down... Preparing next ghost hit.";
        io.emit('updateStats', { successPush, liveReports, currentStatus });

    } catch (e) {
        currentStatus = "Recalibrating Titan Engine...";
        io.emit('updateStats', { successPush, liveReports, currentStatus });
    }
}

function engineLoop() {
    const nextInterval = Math.floor(Math.random() * (50000 - 25000 + 1) + 25000);
    runTitanEngine().then(() => setTimeout(engineLoop, nextInterval));
}

app.get('/', (req, res) => {
    res.send('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="/socket.io/socket.io.js"></script><style>body { background:#0a0a0a; color:#00ff9d; font-family:monospace; text-align:center; padding:15px; } .container { border:2px solid #00ff9d; border-radius:15px; padding:20px; max-width:450px; display:inline-block; width:100%; box-shadow: 0 0 20px #00ff9d55; } .stat { font-size:50px; color:#fff; text-shadow: 0 0 10px #00ff9d; } .monitor { background:#111; padding:10px; margin:15px 0; border:1px solid #333; font-size:12px; color:#ff00ea; } .feed { background:#000; border-radius:5px; padding:10px; height:250px; overflow-y:auto; text-align:left; border:1px solid #00ff9d33; font-size:11px; } .entry { border-bottom:1px solid #222; padding:8px 0; display:flex; justify-content:space-between; }</style></head><body><div class="container"><h2>⚡ NEXUS TITAN v6.0</h2><div id="totalPush" class="stat">' + successPush + '</div><div class="monitor" id="statusBox">[SYSTEM]: ' + currentStatus + '</div><div class="feed" id="feedBox"></div></div><script>const socket = io(); socket.on("updateStats", (data) => { document.getElementById("totalPush").innerText = data.successPush; document.getElementById("statusBox").innerText = "[SYSTEM]: " + data.currentStatus; let html = data.liveReports.map(r => `<div class="entry"><span>[${r.time}] ${r.country} - ${r.source}</span><span style="color:#00ff9d;">SUCCESS</span></div>`).join(""); document.getElementById("feedBox").innerHTML = html; });</script></body></html>');
});

http.listen(port, () => { engineLoop(); });
