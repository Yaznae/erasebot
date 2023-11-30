const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'serveravatar',
    aliases: ['sav'],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        if (!args.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31');
            if (!msg.member.avatar) {
                emb.setDescription(`you do not have a **server avatar** set .`);
            } else {
                emb.setImage(msg.member.displayAvatarURL({ size: 2048, dynamic: true })).setAuthor({ name: `${msg.author.username}'s avatar:` });
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
                    emb.setImage(usr.displayAvatarURL({ size: 2048, dynamic: true })).setAuthor({ name: `${usr.user.username}'s avatar:` })
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