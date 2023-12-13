const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const stfulist = require('./models/stfulist');
let uwulist = require('./models/uwu');
const { default: Uwuifier } = require('uwuifier');
const keepAlive = require('./server');

require('dotenv').config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions
    ]
});

bot.commands = new Collection();
bot.snipes = new Collection();
bot.editsnipes = new Collection();
bot.reactsnipes = new Collection();

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

  let uwu = await uwulist.findOne({ ChannelID: msg.channel.id });
  if (uwu) {
      let webhooks = await msg.channel.fetchWebhooks()
      let webhook = webhooks.find(w => w.url == uwu.Webhook);
      let list = uwu.UwuList;
      let uwuify = new Uwuifier({ words: 1, exclamations: 1, spaces: { faces: 0.3, actions: 0.075, stutters: 0.425} });

      if (list.includes(msg.author.id)) {
          try {
              await msg.delete();
          } catch (err) {
              console.error(err);
          };

          await webhook.send({
              username: msg.member.displayName,
              avatarURL: msg.member.displayAvatarURL({ size: 2048 }),
              content: uwuify.uwuifySentence(msg.content),
            allowedMentions: {
              parse: ['users']
            }
          })
      }
  }
});

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

keepAlive();
bot.login(process.env.TOKEN);