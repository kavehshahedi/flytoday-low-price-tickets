const puppeteer = require('puppeteer');
const moment = require('moment');
require('dotenv').config();

const findTickets = async () => {
    //Check the flights of tomorrow (Based on Tehran timezone)
    const date = moment().utcOffset('+0430').add(1, 'days').format('YYYY-MM-DD');
    const url = `https://www.flytoday.ir/flight/search?departure=${process.env.FROM},1&arrival=${process.env.TO},1&departureDate=${date}&adt=1&chd=0&inf=0&cabin=1`;

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.BROWSER_PATH,
    });

    try {
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.c-flight-search-result', { timeout: 15000 }); //Wait untill the tickes are retrieved

        const result = await page.evaluate(() => {
            const tickets = document.getElementsByClassName('row c-flight-search-result'); //Get all tickets
            const result = [];
            for (const ticket of tickets) {
                try {
                    const price = ticket.getElementsByClassName('Price_Value')[0].getAttribute('data-price');
                    const time = ticket.getElementsByClassName('datetime')[0].innerText.replace(' ', '').split('-')[0];
                    const name = ticket.getElementsByClassName('itlaizice c-MarketingAirline')[0].innerText;
                    const seats = ticket.getElementsByClassName('c-customelabel-warning')[0].innerText.split(' ')[0];
                    const type = ticket.getElementsByClassName('c-customelabel-blue')[0].innerText;

                    //Check if the flight time and price are meeting the conditions
                    const hour = time.split(':')[0];
                    if (parseInt(hour) <= process.env.MAX_HOUR && parseInt(price) < process.env.MAX_PRICE)
                        result.push({ price, time, name, seats, type });
                } catch (err) {
                    console.log('Oops! Something went wrong');
                }
            }

            return result;
        });

        console.log(result);
    } catch (err) {
        console.log('Oops! Something went wrong');
    } finally {
        await browser.close();
    }
}

findTickets();