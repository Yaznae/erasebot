const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'servericon',
    aliases: ['sicon'],
    guildOnly: true,
    async execute(msg, args) {
        let sicon = await msg.guild.iconURL({ dynamic: true, size: 1024 });
        let embed = new EmbedBuilder().setColor('#2b2d31');

        console.log(sicon);

        if (!sicon) {
            embed.setDescription(`this guild **does not** have an **icon** set .`);
        } else {
            embed.setTitle(`${msg.guild.name}'s icon`).setImage(sicon).setURL(sicon);
        }
        return msg.channel.send({ embeds: [embed] });
    }
}