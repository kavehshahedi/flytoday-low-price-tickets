const puppeteer = require('puppeteer');
const moment = require('moment');
require('dotenv').config();

const TelegramBot = require('./bot');

const findTickets = async () => {
    //Check the flights of tomorrow (Based on Tehran timezone)
    const date = moment().utcOffset('+0430').add(process.env.OFFSET_DAYS, 'days').format('YYYY-MM-DD');
    const url = `https://www.flytoday.ir/flight/search?departure=${process.env.FROM},1&arrival=${process.env.TO},1&departureDate=${date}&adt=1&chd=0&inf=0&cabin=1`;

    const browser = await puppeteer.launch({
        headless: true
    });

    try {
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.c-flight-search-result', { timeout: 30000 }); //Wait untill the tickes are retrieved
        page.on('console', (log) => console[log._type](log._text)); //Allow to see the logs in the console

        const result = await page.evaluate((input) => {
            const tickets = document.getElementsByClassName('row c-flight-search-result'); //Get all tickets
            const result = [];
            for (const ticket of tickets) {
                try {
                    const price = ticket.getElementsByClassName('Price_Value')[0].getAttribute('data-price');
                    const time = ticket.getElementsByClassName('datetime')[0].innerText.replace(' ', '').split('-')[0];
                    const name = (ticket.getElementsByClassName('itlaizice c-MarketingAirline')[0] !== undefined ?
                        ticket.getElementsByClassName('itlaizice c-MarketingAirline')[0].innerText : '-');
                    const seats = (ticket.getElementsByClassName('c-customelabel-warning')[0] !== undefined ?
                        ticket.getElementsByClassName('c-customelabel-warning')[0].innerText.split(' ')[0] : -1);
                    const type = (ticket.getElementsByClassName('c-customelabel-blue')[0] !== undefined ?
                        ticket.getElementsByClassName('c-customelabel-blue')[0].innerText : '-');

                    //Check if the flight time and price are meeting the conditions
                    if (price === undefined || time === undefined)
                        continue;

                    const hour = time.split(':')[0];
                    if (parseInt(hour) <= input.max_hour && parseInt(price) < input.max_price)
                        result.push({ price, time, name, seats, type });
                } catch (err) {
                    console.log(String(err));
                }
            }

            return result;
        }, { max_hour: process.env.MAX_HOUR, max_price: process.env.MAX_PRICE }); //Pass the process.env variables to the function

        //Send the tickets to the bot
        TelegramBot.sendTickets({ date: date, tickets: result });
    } catch (err) {
        console.log(err);
    } finally {
        await browser.close();
    }
}

setInterval(() => {
    findTickets();
}, 15 * 60 * 1000); //Check every 15 minutes