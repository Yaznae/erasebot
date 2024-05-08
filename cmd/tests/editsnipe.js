const { EmbedBuilder } = require("discord.js");
const { humanTimeDiff } = require('time_diff_human_readable');

module.exports = {
    name: 'editsnipe',
    aliases: ['es'],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        const snipes = msg.client.editsnipes.get(msg.channel.id) || [];

        if (args.length && !isNum(args[0])) return;
        if (args.length && args[0] > snipes.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`no **snipe** found for index \`${args[0]}\` .`);
            return msg.channel.send({ embeds: [emb] });
        };

        const snipe = snipes[args[0] - 1 || 0];
        if (!snipe) {
            let emb2 = new EmbedBuilder().setColor('#2b2d31').setDescription(`there's no edit to **snipe** .`);
            return msg.channel.send({ embeds: [emb2] });
        }
        if (snipe.content.includes('cord.gg/')) {
            let emb2 = new EmbedBuilder().setColor('#2b2d31').setDescription(`snipes cannot contain **invite links** .`);
            return msg.channel.send({ embeds: [emb2] });
        }

        let currTime = new Date().getTime();
        let emb3 = new EmbedBuilder().setColor('#2b2d31')
            .setAuthor({ name: `@${snipe.author.username}`, iconURL: snipe.author.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `edited ${(currTime - snipe.date) > 5_000 ? humanTimeDiff(currTime, snipe.date) : 'just now'} ∙ ${args[0] || 1}/${snipes.length} messages`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) });
        if (snipe.image) emb3.setImage(snipe.image);
        if (snipe.content) emb3.setDescription(snipe.content);
        let msgId = snipe.msgId;
        let message = await msg.channel.messages.fetch(msgId).catch((err) => console.error(err));
        if (message) {
            return message.reply({ embeds: [emb3] });
        } else {
            return msg.channel.send({ embeds: [emb3] });
        }
    }
}