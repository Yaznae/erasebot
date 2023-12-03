const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        if (!args.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setImage(msg.author.displayAvatarURL({ size: 2048, dynamic: true })).setTitle(`${msg.author.username}'s avatar:`).setURL(msg.author.displayAvatarURL({ size: 2048, dynamic: true }));
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
                const usr = await msg.client.users.fetch(member);
                let emb = new EmbedBuilder().setColor('#2b2d31').setImage(usr.displayAvatarURL({ size: 2048, dynamic: true })).setTitle(`${usr.username}'s avatar:`).setURL(usr.displayAvatarURL({ size: 2048, dynamic: true }));
                return msg.channel.send({ embeds: [emb] });
            } catch (err) {
                console.error(err);
                let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **user** .`)
                return msg.channel.send({ embeds: [emb] });
            }
        }
    }
}