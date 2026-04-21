const { chromium } = require('playwright');
const { stealth } = require('playwright-stealth');
const express = require('express');
const app = express();

// তোমার ডাইরেক্ট লিঙ্ক এখানে সেট করা হয়েছে
const TARGET_URL = 'https://www.profitablecpmratenetwork.com/ud2qw6p3d7?key=275a836a0d6ce5c21562f245c57cdf1a';

async function runNexus() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    // ট্রাফিক সোর্স রোটেশন (গুগল, ফেসবুক, টুইটার থেকে ট্রাফিক যাবে)
    const referers = ['https://www.google.com', 'https://www.facebook.com', 'https://www.twitter.com'];
    const randomReferer = referers[Math.floor(Math.random() * referers.length)];

    console.log(`সেশন শুরু হচ্ছে... ট্রাফিক সোর্স: ${randomReferer}`);
    
    try {
        await page.setExtraHTTPHeaders({ 'Referer': randomReferer });
        await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
        
        // পেজে কিছুক্ষণ অবস্থান করা (১৫-৩০ সেকেন্ড)
        const stayTime = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
        console.log(`পেজে অবস্থান করছে: ${stayTime/1000} সেকেন্ড...`);
        await page.waitForTimeout(stayTime);
        
        console.log('ভিজিট সফল হয়েছে।');
    } catch (error) {
        console.log('ত্রুটি দেখা দিয়েছে:', error.message);
    } finally {
        await browser.close();
    }
}

// অটোমেটিক রান হওয়ার জন্য সার্ভার ট্রিগার
app.get('/', (req, res) => {
    runNexus();
    res.send('<h1>Nexus Vortex Engine is Active!</h1><p>লিঙ্ক ভিজিট শুরু হয়েছে...</p>');
});

app.listen(3000, () => {
    console.log('সার্ভার চালু হয়েছে পোর্টে: 3000');
});

