const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'kick',
    aliases: [],
    reqPerms: [PermissionFlagsBits.KickMembers],
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
        } else if (!isNum(args[0])) {
            mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
            if (mmbr) member = mmbr.id;
        } else if (isNum(args[0])) {
            member = args[0];
        }

        const usr = await msg.guild.members.cache.get(member);

        if (!usr) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **member** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        if (usr.roles && usr.roles.highest.position > msg.member.roles.highest.position) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`you are unable to kick <@${usr.user.id}> as they have a **higher position** than you .`)
            return msg.channel.send({ embeds: [emb] });
        } else if (usr.roles && usr.roles.highest.position > msg.guild.members.me.roles.highest.position) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to kick <@${usr.user.id}> as they have a **higher position** than me .`)
            return msg.channel.send({ embeds: [emb] });
        } else {
            try {
                args.shift()
                let rsn = args.join(' ')
                await usr.ban({ reason: rsn });
                let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`<@${usr.user.id}> was **kicked** .`)
                return msg.channel.send({ embeds: [emb] });
            } catch (err) {
                console.error(err);
                let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`there was a **problem** trying to kick <@${usr.user.id}> .`)
                return msg.channel.send({ embeds: [emb] });
            }
        }
    }
}