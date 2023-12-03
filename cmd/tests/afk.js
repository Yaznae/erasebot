const { EmbedBuilder } = require("discord.js");
const afklist = require('../../models/afk');
const ms = require("ms");

module.exports = {
    name: 'afk',
    guildOnly: true,
    async execute(msg, args) {
        let afk = await afklist.findOne({ MemberID: msg.author.id });
        let reason = args.length ? args.join(' ') : 'AFK';
        let embed = new EmbedBuilder().setColor('#2b2d31');

        if (!afk) {
            await afklist.create({ MemberID: msg.author.id, Guilds: [`${msg.guild.id}#${Date.now()}#${reason}`] });
            embed.setDescription(`> <@${msg.author.id}>: you are now AFK with the status: **${reason}**`);
        } else {
            let guilds = afk.Guilds;
            if (!guilds.includes(msg.guild.id)) {
                guilds.push(msg.guild.id + '#' + Date.now() + '#' + reason);
                await afklist.findOneAndReplace({ MemberID: msg.author.id }, { MemberID: msg.author.id, Guilds: guilds });
                embed.setDescription(`> <@${msg.author.id}>: you are now AFK with the status: **${reason}**`);

            } else { return };
        }
        return msg.channel.send({ embeds: [embed] });
    }
}