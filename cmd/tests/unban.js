const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'unban',
    aliases: [],
    reqPerms: [PermissionFlagsBits.BanMembers],
    guildOnly: true,
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        if (!args.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`no **member** was specified .`)
            return msg.channel.send({ embeds: [emb] });
        }

        let member;
        if (msg.mentions.users.size) {
            member = msg.mentions.users.first().id
        } else if (isNum(args[0])) {
            member = args[0];
        }

        let usr;
        try {
            usr = await msg.guild.bans.fetch({ user: member, force: true });
        } catch (err) {
            console.error(err);
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`that user is **not banned** .`)
            return msg.channel.send({ embeds: [emb] });
        }
        try {
            args.shift()
            let rsn = args.join(' ')
            await msg.guild.bans.remove(member, { reason: rsn });
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`<@${usr.user.id}> was **unbanned** .`)
            return msg.channel.send({ embeds: [emb] });
        } catch (err) {
            console.error(err);
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`there was a **problem** trying to unban that user .`)
            return msg.channel.send({ embeds: [emb] });
        }
    }
}