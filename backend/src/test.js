const puppeteer = require("puppeteer");

async function main() {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://www.google.com");

    console.log("Page title:", await page.title());

    await browser.close();
}

main().catch(console.error);