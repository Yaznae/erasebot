const { EmbedBuilder } = require("discord.js")
const bluntInfo = require('../../models/blunt');
const botInfo = require('../../models/info');

module.exports = {
    name: 'blunt',
    guildOnly: true,
    async execute(msg, args) {
        let emb = new EmbedBuilder()
            .setColor('#2b2d31');

        let pfx;
        let info = await botInfo.findOne({ GuildID: msg.guild.id });
        if (!info) { pfx = process.env.PREFIX } else { pfx = info.Prefix; };

        let blunt = await bluntInfo.findOne({ GuildID: msg.guild.id });

        if (!args.length) {
            if (!blunt) {
                let randomMember;
                await msg.guild.members.fetch().then(members => {
                    randomMember = members.random();
                });
                emb.setDescription(`> <@${randomMember.id}> has the **blunt** . use \`${pfx}blunt grab\` on them to get it .`);
            } else {
                let bluntHolder = await msg.guild.members.cache.get(blunt.BluntHolder);
                emb.setDescription(`> <@${bluntHolder}> has the **blunt** . use \`${pfx}blunt grab\` on them to get it .`);
            };
            return msg.channel.send({ embeds: [emb] });
        } else {
            let subCmd = args.shift();
            switch (subCmd) {
                case 'grab':
            }
        }
    }
}