const express = require('express');
const puppeteer = require('puppeteer');
const pause = require('./lib/pause');
const dateFormat = require('dateformat');

process.setMaxListeners(Infinity);

let app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let url = "https://www.google.com/travel/hotels/%E6%96%B0%E6%A9%8B/place" +
    "/11738745389659249143/prices?ap=MAFiFDEyNDA3NTkzNTQ2NDU4NDY5Nzc0&g2lb=" +
    "4208993%2C4223281%2C4220469%2C4226113%2C4231195&hl=en&gl=jp&un=0&q=%E6%96%B0" +
    "%E6%A9%8B%20%E3%83%9B%E3%83%86%E3%83%AB&rp=OAFAAEgC&ictx=1&ved=0CKwBEKjgAigHahcKEw" +
    "jA1dDS86vgAhUAAAAAHQAAAAAQAQ&hrf=CgYI6IQBEAAiA0pQWSoWCgcI4w8QAhgbEgcI4w8QAhgcGAEgAbABAJ" +
    "oBBxIFVG9reW-iAREKCC9tLzA3ZGZrEgVUb2t5b5IBAiAB&tcfs=EisKCC9tLzA3ZGZrEgVUb2t5bxoYCgoyMDE5LTAyL" +
    "TI3EgoyMDE5LTAyLTI4IhgKCjIwMTktMDItMjcSCjIwMTktMDItMjhSAA";

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
    let priceEles = await page.$$('div.Go1LUe');
    let resultArr = [];
    let today = new Date();

    for (let j = 0; j < 180; j++) {
        let startDate = dateFormat(today.setDate(today.getDate() + j));
        let startMonth = dateFormat(startDate, "mmmm");

        let calendar = await page.$$('div.fSSWab.Io4vne');
        let a = await calendar[0].getElementsByTagName('div');
        for (let b of a) {
            alert( input.value + ': ' + input.checked );
        }
        console.log(a);
        pause()

        await page.click('span > span.DPvwYc.sm8sCf.Jrg3cf');
        await page.waitFor(1500);
        let arr = [dateFormat(today.setDate(today.getDate() + 1), "isoDate")];
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
        resultArr.push(arr)
    }


    console.log(resultArr);
    await page.close()

    // res.set('Content-Type', 'image/png');
    // res.send(imageBuffer);

});

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => console.log('App is running on ' + app.get('port')));
