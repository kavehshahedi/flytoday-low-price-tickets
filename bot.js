const { Telegraf } = require('telegraf');

const Bot = new Telegraf(process.env.BOT_TOKEN);

module.exports.sendTickets = ({ date, tickets }) => {
    let message = `Date: ${date}\n---------------------\n`;
    for (const ticket of tickets) {
        message += `Airline: ${ticket.name}\nTime: ${ticket.time}\nSeats: ${ticket.seats}\nType: ${ticket.type}\nPrice: ${ticket.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} IRR\n\n`;
    }

    Bot.telegram.sendMessage(process.env.CHAT_ID, message);
}

if (process.env.NODE_ENV === 'production') {
    const secretPath = `/telegraf/${Bot.secretPathComponent()}`;
    Bot.telegram.setWebhook(process.env.WEBHOOK_URL + secretPath);

    app.use(Bot.webhookCallback(secretPath));
    app.listen(process.env.PORT || 3000);
}
else {
    Bot.launch();

    process.once('SIGINT', () => Bot.stop('SIGINT'));
    process.once('SIGTERM', () => Bot.stop('SIGTERM'));
}