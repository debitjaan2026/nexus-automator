const express = require('express');
const { chromium } = require('playwright');
const app = express();
const port = process.env.PORT || 3000;

const TARGET_URL = 'https://www.highrevenuegate.com/j76h5v42?key=38198f5a63901b0467b73c88081f215d';

app.get('/', async (req, res) => {
    console.log("ভিজিটর লিঙ্কে ঢোকার চেষ্টা করছে...");
    res.send('<h1>Nexus Engine is Active! Traffic logic is running...</h1>');
    
    let browser;
    try {
        browser = await chromium.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(TARGET_URL);
        console.log("সফলভাবে ট্রাফিক পাঠানো হয়েছে!");
        await browser.close();
    } catch (e) {
        console.log("ব্রাউজার এরর: " + e.message);
    }
});

app.listen(port, () => {
    console.log("ইঞ্জিন এখন লাইভ আছে!");
});
