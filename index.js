const express = require('express');
const puppeteer = require('puppeteer');
const pause = require('./lib/pause');
const dateFormat = require('dateformat');

process.setMaxListeners(Infinity);

let app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let url = "https://www.google.com/travel/hotels/%E6%96" +
    "%B0%E6%A9%8B/place/11738745389659249143/prices?hl=en&" +
    "gl=jp&un=0&q=%E6%96%B0%E6%A9%8B%20%E3%83%9B%E3%83%86%E3%" +
    "83%AB&tcfs=EhoaGAoKMjAxOS0wMi0xMxIKMjAxOS0wMi0xNCIYCgoyMDE5" +
    "LTAyLTEzEgoyMDE5LTAyLTE0UgA&hrf=KhYKBwjjDxACGA0SBwjjDxACGA4YASAB";

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function (req, res) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false
    });
    const page = await browser.newPage();
    const override = Object.assign(page.viewport(), {width: 1000});
    await page.setViewport(override);
    await page.goto(url);
    let resultArr = [];
    const today = new Date();

    for (let j = 0; j < 180; j++) {
        /**
         * Click to Calendar
         */
        let startDate = dateFormat(today, "yyyy-mm-dd");
        let endDate = dateFormat(today.setDate(today.getDate() + 1), "yyyy-mm-dd");
        console.log(startDate + "|||" + endDate);

        await page.click('#prices > c-wiz > div > div > div > div.Co7Mfe.EtchBc' +
            ' > div > div > div > div > div:nth-child(2)');

        if (j === 0) {
            await page.click(`div.fSSWab.Io4vne[data-iso="${startDate}"]`);
            console.log(1);
            await page.click(`div.fSSWab.Io4vne[data-iso="${endDate}"]`);
            console.log(2);
            await page.click('button.VfPpkd-LgbsSe.ksBjEc.Tq8g8b');
            console.log(3);
            await page.waitFor(2200);
            console.log(4);
        } else {
            dateFormat(today.setDate(today.getDate() + 1), "yyyy-mm-dd");
            await page.click('#prices > c-wiz > div > div > div > div.Co7Mfe.EtchBc > div > div > div > div > ' +
                'div:nth-child(2) > div.U26fgb.mUbCce.fKz7Od.C6BbGb.GwzyAc.cU51ne');
            await page.click('button.VfPpkd-LgbsSe.ksBjEc.Tq8g8b');
            await page.waitFor(2200);
        }


        let arr = [startDate];
        // today.setDate(today.getDate() + 1);

        /**
         * Get Price List
         */
        let priceEles = await page.$$('div.Go1LUe');
        if (priceEles) {
            for (let i = 0; i < priceEles.length; i++) {
                let channelSel = await priceEles[i].$(' div > div.nfhVYd');
                let channel = await channelSel.getProperty('innerHTML');
                let channelName = await channel.jsonValue();

                let priceSel = await priceEles[i].$('div > span.ZTbtcd > span');
                let price = await priceSel.getProperty('innerHTML');
                let finalPrice = await price.jsonValue();

                arr.push({
                    channel: channelName,
                    price: finalPrice
                })
            }
        }
        resultArr.push(arr);
        console.log(arr);

        // await page.click('#prices > c-wiz > div > div > div > div.Co7Mfe.EtchBc > div > div > div > div > ' +
        //     'div:nth-child(2) > div.U26fgb.mUbCce.fKz7Od.C6BbGb.GwzyAc.cU51ne');
        // pause()
        if (j > 10) pause();
        // await page.waitFor(2200)
    }

    console.log(resultArr);
    await page.close()

    // res.set('Content-Type', 'image/png');
    // res.send(imageBuffer);

});

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => console.log('App is running on ' + app.get('port')));
