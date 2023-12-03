const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const info = require('../models/apfp');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(bot) {
        console.log(`# logged in as @${bot.user.username} (${bot.user.id})`);
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`# connected to database`);

        let apfpDetails = await info.find({ Up: true });
        setInterval(async function () {
            apfpDetails = await info.find({ Up: true });
            apfpDetails.forEach(async server => {
                let srvr = await info.findOne({ GuildID: server.GuildID });

                const pfpPath = path.join(__dirname, '../pfps');
                const pfps = await fs.readdirSync(pfpPath);
                let pfp;
                let emb = new EmbedBuilder().setColor('#2b2d31').setFooter({ text: 'discord.gg/erase : autopfp' });

                if (srvr.Up) {
                    let serv = bot.guilds.cache.get(srvr.GuildID);
                    let chnl = serv.channels.cache.get(srvr.ChannelID);

                    try {
                        pfp = new AttachmentBuilder(`${__dirname}../../pfps/${pfps[Math.floor(Math.random() * pfps.length)]}`).setName('erasepfp.png');
                        emb.setImage('attachment://erasepfp.png');
                    } catch (e) { console.error(e) }
                    await chnl.send({ embeds: [emb], files: [pfp] });
                } else {
                    return
                };
            });
        }, 30_000);

    },
};