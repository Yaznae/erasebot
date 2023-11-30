const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const avhistory = require("../../models/avh");

module.exports = {
    name: 'avatarhistory',
    aliases: ['avh'],
    async execute(msg, args) {
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

        let usr = await msg.client.users.cache.get(member);
        if (!usr) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`unable to find that **user** .`)
            return msg.channel.send({ embeds: [emb] });
        } else {
            let emb1 = new EmbedBuilder().setColor(`#2b2d31`).setAuthor({ name: `${usr.username}'s avatar history:` });
            let res;
            let larrow = new ButtonBuilder()
                .setEmoji('<:leftarrow1:1179900394772639744>')
                .setCustomId('avhleft')
                .setStyle(ButtonStyle.Secondary);
            let rarrow = new ButtonBuilder()
                .setEmoji('<:rightarrow1:1179900396592955442>')
                .setCustomId('avhright')
                .setStyle(ButtonStyle.Secondary);
            let cancel = new ButtonBuilder()
                .setEmoji('<:cancel:1179902695881052311>')
                .setCustomId('avhcancel')
                .setStyle(ButtonStyle.Secondary)
            let avh = await avhistory.findOne({ MemberID: member });
            if (!avh) {
                let lista = [`${usr.displayAvatarURL({ size: 2048, dynamic: true })}#${Math.floor(Date.now() / 1000)}`];
                await avhistory.create({ MemberID: member, AvatarHistory: lista });
                emb1.setImage(usr.displayAvatarURL({ size: 2048, dynamic: true }))
                    .setFooter({ text: `avatar 1/1` })
                    .setDescription(`<t:${Math.floor(Date.now() / 1000)}:R>`);

                larrow.setDisabled(true);
                rarrow.setDisabled(true);

                let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);

                res = await msg.channel.send({ embeds: [emb1], components: [row] });
            } else {
                let avhist = avh.AvatarHistory;
                emb1.setImage(avhist[0].split('#')[0])
                    .setFooter({ text: `avatar 1/${avh.AvatarHistory.length}` })
                    .setDescription(`<t:${avhist[0].split('#')[1]}:R>`);

                larrow.setDisabled(true);
                if (avh.AvatarHistory.length == 1) { rarrow.setDisabled(true); }

                let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);

                res = await msg.channel.send({ embeds: [emb1], components: [row] });
            }

            try {
                const nextAV = await res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });
                let i = 0;
                console.log(i)

                nextAV.on('collect', async intr => {
                    if (intr.user.id !== msg.author.id) return;
                    if (intr.customId == 'avhleft') {
                        intr.deferUpdate();
                        i -= 1;
                        emb1.setImage(avh.AvatarHistory[i].split('#')[0]).setFooter({ text: `avatar ${i + 1}/${avh.AvatarHistory.length}` }).setDescription(`<t:${avh.AvatarHistory[i].split('#')[1]}:R>`);
                        if (i <= 0) larrow.setDisabled(true);
                        if (i < avh.AvatarHistory.length - 1) rarrow.setDisabled(false);
                        let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                        try {
                            await res.edit({ embeds: [emb1], components: [row] });
                        } catch (e) { console.error(e) };
                    } else if (intr.customId == 'avhright') {
                        intr.deferUpdate();
                        i += 1;
                        emb1.setImage(avh.AvatarHistory[i].split('#')[0]).setFooter({ text: `avatar ${i + 1}/${avh.AvatarHistory.length}` }).setDescription(`<t:${avh.AvatarHistory[i].split('#')[1]}:R>`);
                        larrow.setDisabled(false);
                        if (i == avh.AvatarHistory.length - 1) rarrow.setDisabled(true);
                        let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                        try {
                            await res.edit({ embeds: [emb1], components: [row] });
                        } catch (e) { console.error(e) };
                    } else if (intr.customId == 'avhcancel') {
                        intr.deferUpdate();
                        try {
                            await res.edit({ embeds: [emb1], components: [] });
                        } catch (e) { console.error(e) };
                    }
                })
            } catch (err) {
                await res.edit({ embeds: [emb1], components: [] });
            }
        }
    }
}