const { PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'lockdeny',
    aliases: ['deny', 'ld'],
    reqPerms: [PermissionFlagsBits.ManageChannels],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        let member;
        if (msg.mentions.users.size) {
            member = msg.mentions.users.first().id
        } else if (!isNum(args[0])) {
            mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
            if (mmbr) member = mmbr.id;
        } else if (isNum(args[0])) {
            member = args[0];
        }

        let usr = await msg.guild.members.cache.get(member);

        if (!usr) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **user** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        if (new PermissionsBitField(msg.channel.permissionsFor(msg.guild.roles.everyone)).toArray().includes('SendMessages')) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`this channel is **not locked** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        await msg.channel.permissionOverwrites.delete(member);
        let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`<@${member}> has been **denied** to talk .`);
        return msg.channel.send({ embeds: [emb] });
    }
}