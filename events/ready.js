const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {

        console.log(`# logged in as @${bot.user.username} (${bot.user.id})`);
    },
};