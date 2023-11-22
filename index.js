const fs = require("fs");
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const path = require('path');

async function createPDFFromURL(url) {
    const browser = await puppeteer.launch({
        dumpio: false,
        pipe: true,
        headless: false,
        args: ['--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-dev-profile', '-remote-debugging-port=9222']
    });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle0' });

        console.log("generating PDF");

        await page.pdf({ path: `x.pdf`, format: "A4", scale: 0.5 });
        console.log('pdf generated successfully');
        await browser.close();

    } catch (error) {
        console.error("Error:", error);
    }
}

app.get('/', async (req, res) => {
    console.log('request initialized');
    try {
        await createPDFFromURL('https://github.com/07-Mayankraj')
        const filePath = path.join(__dirname, 'x.pdf');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return res.status(500).send('Error reading the PDF file');
            }

            res.contentType('application/pdf');
            res.send(data);
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error generating PDF');
    }
})
app.listen(4000, () => console.log('app running'));
