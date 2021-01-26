const puppeteer = require('puppeteer')


const url_bestbuy = 'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324'
// const url_bestbuy = 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3/'

async function configureBrowser() {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0) //bestbuy loads super slow

    // Optimization attempt to speed up page load
    await page.setRequestInterception(true)

    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet'){
            request.abort()
        } else {
            request.continue()
        }
    })

    await page.goto(url_bestbuy)
    return page
}

async function checkStock(page) {
    await page.reload()
    // let html = await page.evaluate(() => document.body.innerHTML)
    let buttonText = await page.$eval('.add-to-cart-button', el => el.innerText)
    // console.log(buttonText)
    if (buttonText == 'Sold Out'){
        console.log('The Xbox Series X is sold out at bestbuy.com')
    } else {
        console.log('The Xbox Series X might be in stock at bestbuy.com')
    }

   
}

async function monitor() {
    let page = await configureBrowser()
    await checkStock(page)
}

monitor()