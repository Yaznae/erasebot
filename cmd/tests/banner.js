const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'banner',
    aliases: ['b'],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        if (!args.length) {
            let usr = await msg.author.fetch({ force: true });
            let emb = new EmbedBuilder().setColor('#2b2d31');
            if (!usr.banner) {
                emb.setDescription(`> you don't have a **banner** set .`);
            } else {
                emb.setImage(usr.bannerURL({ size: 512, dynamic: true })).setTitle(`${usr.username}'s banner :`).setURL(usr.bannerURL({ size: 512, dynamic: true }));
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
                const usr = await msg.client.users.fetch(member, { force: true });
                let emb = new EmbedBuilder().setColor('#2b2d31');
                if (!usr.banner) {
                    emb.setDescription(`> <@${usr.id}> doesn't have a **banner** set .`);
                } else {
                    emb.setImage(usr.bannerURL({ size: 512, dynamic: true })).setTitle(`${usr.username}'s banner :`).setURL(usr.bannerURL({ size: 512, dynamic: true }));
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