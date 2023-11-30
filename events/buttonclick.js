/*
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const avhistory = require('../models/avh');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isButton()) {
            let i = 0;
            let emb1 = new EmbedBuilder().setColor(`#2b2d31`).setAuthor({ name: `${interaction.user.username}'s avatar history:` });
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
            let avhist = await avhistory.findOne({ MemberID: interaction.user.id });
            let avh = avhist.AvatarHistory;

            if (interaction.customId == 'avhleft') {
                i -= 1;
                emb1.setImage(avh[i].split('#')[0]).setFooter({ text: `avatar ${i}/${avh.length}` }).setDescription(`<t:${avh[i].split('#')[1]}:R>`);
                if (i <= 1) larrow.setDisabled(true);
                let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                try {
                    await int.message.edit({ embeds: [emb1], components: [row] });
                } catch (e) { console.error(e) };
            } else if (interaction.customId == 'avhright') {
                i += 1;
                emb1.setImage(avh[i].split('#')[0]).setFooter({ text: `avatar ${i}/${avh.length}` }).setDescription(`<t:${avh[i].split('#')[1]}:R>`);
                if (i == avh.length) rarrow.setDisabled(true);
                let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                try {
                    await interaction.message.edit({ embeds: [emb1], components: [row] });
                } catch (e) { console.error(e) };
            }

        }
    },
};
*/