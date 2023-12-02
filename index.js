const { Client, GatewayIntentBits, Events, Collection, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const stfulist = require('./models/stfulist');

require('dotenv').config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.GuildMember,
        Partials.Reaction,
        Partials.Message
    ]
});

bot.commands = new Collection();
bot.snipes = new Collection();

const fPath = path.join(__dirname, 'cmd');
const folders = fs.readdirSync(fPath);

bot.on('messageCreate', async (msg) => {
    if (msg.guild == null) return;
    let list = await stfulist.findOne({ GuildID: msg.guild.id });
    if (list) {
        let stfus = list.StfuList;
        if (stfus.includes(msg.author.id)) {
            try {
                return msg.delete();
            } catch (err) {
                return console.error(err)
            }
        }
    }
});

bot.on('userUpdate', async (oldUser, newUser) =>  {
    if (oldUser.partial) await oldUser.fetch(true);

    if (newUser.avatar !== oldUser.avatar) {
        
    }
})

for (const folder of folders) {
    const cPath = path.join(fPath, folder);
    const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith('.js'));
    for (const file of cFiles) {
        const cmdPath = path.join(cPath, file);
        const cmd = require(cmdPath);

        if ('name' in cmd && 'execute' in cmd) {
            bot.commands.set(cmd.name, cmd);
        } else return;
    } 
}

const ePath = path.join(__dirname, 'events');
const events = fs.readdirSync(ePath);

for (const file of events) {
    const filePath = path.join(ePath, file);
    const event = require(filePath);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    };
};

bot.login(process.env.TOKEN);