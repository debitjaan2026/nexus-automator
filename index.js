const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log("ইঞ্জিন সচল আছে - " + new Date().toLocaleTimeString());
    res.send('<h1>Nexus Engine is Active!</h1>');
});

app.listen(3000, () => {
    console.log('সার্ভার পুরোপুরি রেডি! এখন লিংকে ক্লিক করলে এখানে মেসেজ আসবে।');
});
