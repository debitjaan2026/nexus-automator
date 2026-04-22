const { chromium } = require('playwright');
const express = require('express');
const app = express();

// এখানে আপনার আসল Adsterra লিঙ্কটি বসান
const MY_AD_LINK = 'আপনার_অ্যাড_লিঙ্ক_এখানে'; 

async function sendTraffic() {
    console.log("বট কাজ শুরু করছে...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(MY_AD_LINK, { waitUntil: 'networkidle', timeout: 60000 });
        console.log("লিঙ্কে সফলভাবে ট্রাফিক পাঠানো হয়েছে: " + new Date().toLocaleTimeString());
    } catch (e) {
        console.log("ত্রুটি: " + e.message);
    } finally {
        await browser.close();
    }
}

app.get('/', (req, res) => {
    sendTraffic(); // লিঙ্কে ক্লিক করলেই বট রান হবে
    res.send('<h1>Nexus Engine is Sending Traffic!</h1>');
});

app.listen(3000, () => console.log('ইঞ্জিন পুরোপুরি প্রস্তুত!'));
