const { EmbedBuilder, ButtonStyle, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const avhistory = require("../../models/avh");
const { Pagination } = require('pagination.djs');
const { ImgurClient } = require('imgur');

module.exports = {
    name: 'avatarhistory',
    aliases: ['avh'],
    async execute(msg, args) {

        const pagination = new Pagination(msg, {
            firstEmoji: '<:skipleft:1180996476353118248>',
            prevEmoji: '<:leftarrow1:1179900394772639744>',
            nextEmoji: '<:rightarrow1:1179900396592955442>',
            lastEmoji: '<:skipright:1180996474822217738>',
            buttonStyle: ButtonStyle.Secondary,
            idle: 30_100,
            limit: 1,
            loop: false
        });

        function isNum(str) {
            return /^\d+$/.test(str);
        }

        let member;

        if (!args.length) {
            member = msg.author.id;
        } else {
            if (msg.mentions.users.size) {
                member = msg.mentions.users.first().id
            } else if (!isNum(args[0])) {
                mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
                if (mmbr) member = mmbr.id;
            } else if (isNum(args[0])) {
                member = args[0];
            }
        };

        let user = await msg.client.users.cache.get(member);
        if (!user) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **user** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        user = await msg.client.users.fetch(user.id, { force: true });

        let avatarHistory = await avhistory.findOne({ MemberID: member });
        let imgur = new ImgurClient({ accessToken: process.env.ACCESS_TOKEN });

        if (!avatarHistory || !avatarHistory.AvatarHistory.length) {
            if (!avatarHistory) {
                let url;
                if (user.avatar.startsWith('a_')) { 
                    url = user.displayAvatarURL({ dynamic: true, size: 1024 }); 
                } else { 
                    url = user.displayAvatarURL({ extension: 'png', size: 1024 }); 
                };

                let postimg = await imgur.upload({ image: url, title: `${user.avatar}`, description: `erase bot avatar history for ${user.username}` });
                let res = postimg.data;

                console.log(res);

                await avhistory.create({ MemberID: member, AvatarHistory: [`${res.link}#${Math.floor(Date.now() / 1000)}`] });
            } else {
                let url;
                if (user.avatar.startsWith('a_')) { 
                    url = user.displayAvatarURL({ dynamic: true, size: 1024 }); 
                } else { 
                    url = user.displayAvatarURL({ extension: 'png', size: 1024 }); 
                };

                let postimg = await imgur.upload({ image: url, title: `${user.avatar}`, description: `erase bot avatar history for ${user.username}` });
                let res = postimg.data;

                await avhistory.findOneAndUpdate({ MemberID: member }, { AvatarHistory: [`${res.link}#${Math.floor(Date.now() / 1000)}`] });
            }

            pagination.setAuthor({ name: `${user.username}'s avatar history:` });
            pagination.setDescription(`<t:${Math.floor(Date.now() / 1000)}:R>`);
            pagination.setImage(user.displayAvatarURL({ size: 1024, dynamic: true }));
            pagination.setFooter({ text: `avatar: 1/1` });

            return pagination.send();
        } else {
            let avis = avatarHistory.AvatarHistory;
            let avatars = [];
            let descs = [];

            avis.forEach(async avi => {
                let avInfo = avi.split('#');

                try {
                    avatars.push(avInfo[0]);
                    descs.push(`<t:${avInfo[1]}:R>`);
                } catch (e) { console.error(e); }

            });

            pagination.setDescriptions(descs);
            pagination.setImages(avatars);
            pagination.setAuthor({ name: `${user.username}'s avatar history:` });
            pagination.setColor('#2b2d31');
            pagination.setFooter({ text: `avatar: {pageNumber}/{totalPages}` });

            return pagination.send()
        }

    }
}