const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'serveravatar',
    aliases: ['sav'],
    guildOnly: true,
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        if (!args.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31');
            if (!msg.member.avatar) {
                emb.setDescription(`you do not have a **server avatar** set .`);
            } else {
                emb.setImage(msg.member.displayAvatarURL({ size: 2048, dynamic: true })).setTitle(`${msg.member.nickname ? msg.member.nickname : msg.member.user.username}'s server avatar :`).setURL(msg.member.displayAvatarURL({ size: 2048, dynamic: true }));
            }
            return msg.channel.send({ embeds: [emb] });
        } else {
            let member;
            if (msg.mentions.users.size) {
                member = msg.mentions.users.first().id
            } else if (!isNum(args[0])) {
                mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
                if (mmbr) member = mmbr.id;
            } else if (isNum(args[0])) {
                member = args[0];
            }

            try {
                const usr = await msg.guild.members.fetch(member);
                let emb = new EmbedBuilder().setColor('#2b2d31');
                if (!usr.avatar) {
                    emb.setDescription(`<@${usr.user.id}> does not have a **server avatar** set .`)
                } else {
                    emb.setImage(usr.displayAvatarURL({ size: 2048, dynamic: true })).setTitle(`${usr.user.username}'s avatar:`).setURL(usr.displayAvatarURL({ size: 2048, dynamic: true }));
                }
                return msg.channel.send({ embeds: [emb] });
            } catch (err) {
                console.error(err);
                let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **user** .`)
                return msg.channel.send({ embeds: [emb] });
            }
        }
    }
}