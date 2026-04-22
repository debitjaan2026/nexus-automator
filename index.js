const express = require('express');
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

let trafficCount = 0;
let lastLog = "Initializing...";

async function runTraffic() {
    try {
        try {
            execSync('npx playwright install chromium', { stdio: 'inherit' });
        } catch (e) {
            console.log("Installing browsers...");
        }

        const browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();
        const targetUrl = "https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d"; 
        
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        trafficCount++;
        lastLog = "Traffic sent successfully";
        console.log(lastLog);

        await browser.close();
    } catch (error) {
        lastLog = "Error: " + error.message;
        console.error(lastLog);
    }
}

setInterval(runTraffic, 30000);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Nexus Monitor</title></head>
            <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding:50px;">
                <h1 style="color:#38bdf8;">🚀 Nexus Smart Monitor</h1>
                <div style="background:#1e293b; padding:20px; border-radius:10px; display:inline-block; border:1px solid #38bdf8;">
                    <h2>Total Traffic: ${trafficCount}</h2>
                    <p>Status: <span style="color:#4ade80;">Live</span></p>
                    <p style="font-size:12px; color:#94a3b8;">Log: ${lastLog}</p>
                </div>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log("Server running...");
    runTraffic(); 
});
