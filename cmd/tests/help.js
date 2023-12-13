const { EmbedBuilder } = require("discord.js")
let info = require('../../models/info');

module.exports = {
    name: 'help',
    aliases: ['cmds'],
    async execute(msg, args) {
        let pfx;
        let sinfo = await info.findOne({ GuildID: msg.guild.id });

        if (!sinfo) {
            pfx = process.env.PREFIX;
        } else {
            pfx = sinfo.Prefix;
        };

        let emb = new EmbedBuilder()
            .setColor('#2b2d31')
            .setAuthor({ name: 'list of commands :', iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`use \`${pfx}help [command]\` for more information .`)
            .setFields(
                { name: 'information :', value: `\`${pfx}serverinfo\`\n\`${pfx}roles\`\n\`${pfx}avatar\`\n\`${pfx}banner\`\n\`${pfx}avatarhistory\`\n\`${pfx}serveravatar\`\n\`${pfx}servericon\``, inline: true },
                { name: 'moderation :', value: `\`${pfx}kick\`\n\`${pfx}ban\`\n\`${pfx}unban\`\n\`${pfx}lock\`\n\`${pfx}unlock\`\n\`${pfx}lockpermit\`\n\`${pfx}lockdeny\`\n\`${pfx}vanityblacklist\``, inline: true },
                { name: 'settings :', value: `\`${pfx}autopfps\`\n\`${pfx}prefix\``, inline: true },
                { name: 'fun :', value: `\`${pfx}grabip\`\n\`${pfx}uwuify\`\n\`${pfx}stfu\``, inline: true }
            )
            .setTimestamp();

        return msg.channel.send({ embeds: [emb]});
    }
}