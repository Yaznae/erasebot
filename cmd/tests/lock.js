const { PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'lock',
    reqPerms: [PermissionFlagsBits.ManageChannels],
    async execute(msg, args) {
        if (!new PermissionsBitField(msg.channel.permissionsFor(msg.guild.roles.everyone)).toArray().includes('SendMessages')) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`this channel is **already locked** .`)
            return msg.channel.send({ embeds: [emb] });
        }

        await msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: false });
        let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`this channel has been **locked** .`);
        return msg.channel.send({ embeds: [emb] });
    }
}