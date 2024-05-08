const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionRemove,
    once: false,
    async execute(react, user) {
        if (react.partial) await react.fetch();

        const snipes = react.client.reactsnipes.get(react.message.channel.id) || [];
        const currDate = new Date();
        if (user.bot) return;

        snipes.unshift({
            emoji: react.emoji,
            author: user,
            date: currDate.getTime(),
            msgId: react.message.id
        });
        snipes.splice(10);
        react.client.reactsnipes.set(react.message.channel.id, snipes);
    },
};