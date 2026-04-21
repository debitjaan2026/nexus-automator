const { chromium } = require('playwright');
const express = require('express');
const app = express();

const TARGET_URL = 'https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a';

async function runNexus() {
    // আমরা আপাতত জটিল 'stealth' মোড বাদ দিয়ে সরাসরি ব্রাউজার চালাচ্ছি
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    const referers = ['https://www.google.com', 'https://www.facebook.com', 'https://www.bing.com'];
    const randomReferer = referers[Math.floor(Math.random() * referers.length)];

    console.log(`কাজ শুরু হচ্ছে... রেফারার: ${randomReferer}`);
    
    try {
        await page.setExtraHTTPHeaders({ 'Referer': randomReferer });
        await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 60000 });
        
        const stayTime = Math.floor(Math.random() * 15000) + 15000;
        console.log(`অপেক্ষা করছি: ${stayTime/1000} সেকেন্ড...`);
        await page.waitForTimeout(stayTime);
        
        console.log('ভিজিট সফল হয়েছে!');
    } catch (error) {
        console.log('ত্রুটি:', error.message);
    } finally {
        await browser.close();
        console.log('ব্রাউজার বন্ধ করা হয়েছে।');
    }
}

app.get('/', (req, res) => {
    runNexus();
    res.send('<h1>Nexus Engine is Active!</h1>');
});

app.listen(3000, () => {
    console.log('সার্ভার রেডি!');
});
