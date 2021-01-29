const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob
const {performance} = require('perf_hooks')


const url_bestbuy = 'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324'
// const url_bestbuy = 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3/'

async function configureBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/chromium-browser',
        userDataDir: '/home/pi/programming/web_projects/isXboxInStock/puppeteer_data'
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0) //bestbuy loads super slow

    // Optimization attempt to speed up page load
    await page.setRequestInterception(true)

    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() == 'font'){
            request.abort()
        } else {
            request.continue()
        }
    })

    await page.goto(url_bestbuy)
    return page
}

async function checkStock(page) {
    const t0 = performance.now()
    await page.reload({waitUntil: 'domcontentloaded'})
    const t1 = performance.now()
    console.log('page reload took ' + (t1 - t0) + ' milliseconds.')
    // let html = await page.evaluate(() => document.body.innerHTML)
    const evalT0 = performance.now()
    let buttonText = await page.$eval('.add-to-cart-button', el => el.innerText)
    const evalT1 = performance.now()
    console.log('Eval took ' + (evalT1 - evalT0) + ' milliseconds.')

    console.log(buttonText)
    if (buttonText == 'Sold Out'){
        console.log('The Xbox Series X is sold out at bestbuy.com. ')
    } else {
        console.log('The Xbox Series X might be in stock at bestbuy.com')
    }

   
}

async function startTracking() {
    const page = await configureBrowser()

    let job = new CronJob('*/60 * * * * *', function () {
        checkStock(page)
    }, null, true, null, null, true)
    job.start()
}

startTracking()

// async function monitor() {
//     let page = await configureBrowser()
//     await checkStock(page)
// }

// monitor()