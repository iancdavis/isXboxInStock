const puppeteer = require('puppeteer')


const url_bestbuy = 'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324'
// const url_bestbuy = 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3/'

async function configureBrowser() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0) //bestbuy loads super slow
    await page.goto(url_bestbuy)
    return page
}

async function checkStock(page) {
    await page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)
    console.log(html)
}

async function monitor() {
    let page = await configureBrowser()
    await checkStock(page)
}

monitor()