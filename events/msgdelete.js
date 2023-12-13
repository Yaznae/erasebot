const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(msg) {
        const snipes = msg.client.snipes.get(msg.channel.id) || [];
        const currDate = new Date();

        if (msg.partial) await msg.fetch();

        if (msg.author.bot) return;

        console.log(msg.stickers.first())

        snipes.unshift({
            content: msg.content,
            author: msg.author,
            image: msg.attachments.first() ? msg.attachments.first().proxyURL : null,
            date: currDate.getTime(),
            sticker: msg.stickers.first() ? msg.stickers.first() : null
        });
        snipes.splice(20);
        msg.client.snipes.set(msg.channel.id, snipes);
    },
};