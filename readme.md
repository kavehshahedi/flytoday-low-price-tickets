# Flytoday Low Price Tickets Finder
This project checks the **Flytoday.ir** website to find the lowest price tickets based on the conditions you set. It also can send the results to your **Telegram Account** using a simple Bot, which you can easily create with *@BotFather*.

## Project Setup
1. Clone the project
```
$ git clone https://github.com/kavehshahedi/flytoday-low-price-tickets.git
```
2. Install the required dependencies
```
$ cd flytoday-low-price-tickets
$ npm i
```
3. Set the environment variables (*.env*)
```
BROWSER_PATH=XXX/chrome.exe

FROM=XXX //For instance, THR (Tehran)
TO=XXX //For instance, YTO (Toronto)

MAX_HOUR=10 //Only flights before 10:00 am
MAX_PRICE=20000000 //Only flighs cheaper than 20,000,000 IRR

CHAT_ID=XXX //Your Telegram account Chat ID
BOT_TOKEN=XXX //The Telegram Bot token

WEBHOOK_URL=https://xxx.xxx //The Webhook URL for the Telegram Bot Webhook

NODE_ENV=development //Or production
```
4. Run the project
```
$ npm start
```
5. Wait untill the project fetches the tickets, and sends it to your Telegram account!

>Note that the interval rate between each search might cause into *Captcha Check*. Hence, it is recommended to not set the interval rate below 15 minutes.