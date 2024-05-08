const { EmbedBuilder } = require("discord.js");
const { humanTimeDiff } = require('time_diff_human_readable');

module.exports = {
    name: 'reactionsnipe',
    aliases: ['reactsnipe', 'rs'],
    guildOnly: true,
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        const snipes = msg.client.reactsnipes.get(msg.channel.id) || [];
        
        if (args.length && !isNum(args[0])) return;
        if (args.length && args[0] > snipes.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`no **snipe** found for index \`${args[0]}\` .`);
            return msg.channel.send({ embeds: [emb] });
        };

        const snipe = snipes[args[0] - 1 || 0];
        if (!snipe) {
            let emb2 = new EmbedBuilder().setColor('#2b2d31').setDescription(`there's no reaction to **snipe** .`);
            return msg.channel.send({ embeds: [emb2] });
        }

        console.log(snipe.emoji)
        let emoji;
        if (!snipe.emoji.id) {
            emoji = snipe.emoji
        } else {
            if (msg.guild.emojis.cache.get(snipe.emoji.id)) {
                emoji = `<${snipe.emoji.animated ? 'a_' : ''}${snipe.emoji.name}:${snipe.emoji.id}>`
            } else {
                emoji = `:${snipe.emoji.name}\\:`
            }
        }

        let emb3 = new EmbedBuilder().setColor('#2b2d31')
            .setFooter({ text: `reacted ${humanTimeDiff(new Date().getTime(), snipe.date)} ∙ ${args[0] || 1}/${snipes.length} reactions`})
            .setDescription(`**${snipe.author.username}** reacted with ${emoji}`);
        let message = await msg.channel.messages.fetch(snipe.msgId);
        if (message) {
            return message.reply({ embeds: [emb3] });
        } else {
            return msg.channel.send({ embeds: [emb3] })
        }
    }
}