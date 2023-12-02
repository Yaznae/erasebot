const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'clearsnipe',
    aliases: ['clearsnipes', 'cs'],
    reqPerms: [PermissionFlagsBits.ManageMessages],
    guildOnly: true,
    async execute(msg, args) {
        if (msg.client.snipes.get(msg.channel.id)) {
            msg.client.snipes.set(msg.channel.id, []);
        };
        let emb = new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription(`cleared **snipe cache** for this channel .`)
        return msg.channel.send({ embeds: [emb] });
    }
}