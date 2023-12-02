const { PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'unlock',
    reqPerms: [PermissionFlagsBits.ManageChannels],
    guildOnly: true,
    async execute(msg, args) {
        if (new PermissionsBitField(msg.channel.permissionsFor(msg.guild.roles.everyone)).toArray().includes('SendMessages')) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`this channel is **not locked** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        await msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: true });
        let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`this channel has been **unlocked** .`);
        return msg.channel.send({ embeds: [emb] });
    }
}