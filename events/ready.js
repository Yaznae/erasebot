const { Events } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(bot) {
        console.log(`# logged in as @${bot.user.username} (${bot.user.id})`);
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`# connected to database`);
    },
};