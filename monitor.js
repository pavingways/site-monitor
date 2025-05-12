const puppeteer = require('puppeteer');
const fs = require('fs');
const LOG_FILE = './monitor.log';
const URL = process.env.URL;
const TIMEOUT = process.env.TIMEOUT || 10000;

if (!URL) {
    console.error('URL not set');
    process.exit(1);
}

(async () => {
    const timestamp = new Date().toISOString();
    let browser;

    let log = `[${timestamp}] ACCESSING: ${URL}\n`;
    fs.appendFileSync(LOG_FILE, log);

    try {
        browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
        const page = await browser.newPage();
        const errors = [];

        page.on('pageerror', error => errors.push(`PAGE ERROR: ${error.message}`));
        page.on('requestfailed', req => errors.push(`REQUEST FAILED: ${req.url()} (${req.failure().errorText})`));

        const response = await page.goto(URL, {waitUntil: 'networkidle2', timeout: TIMEOUT});

        if (!response || response.status() !== 200) {
            errors.push(`FAIL with status: ${response ? response.status() : 'no response'}`);
        }

        const bodyHTML = await page.content();
        if (bodyHTML.length < 1000) {
            errors.push('CONTENT: too short - possible white screen');
        }

        // log errors
        if (errors.length > 0) {
            log = `[${timestamp}] ${errors.join('; ')}\n`;
            fs.appendFileSync(LOG_FILE, log);
        }
    } catch (err) {
        log = `[${timestamp}] FATAL: ${err.message}\n`;
        fs.appendFileSync(LOG_FILE, log);
    } finally {
        if (browser) await browser.close();
    }

    // log to console
    log.split("\n").forEach(line => console.log(line));
})();
