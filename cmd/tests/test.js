const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'test',
    aliases: ['tst'],
    ownerOnly: true,
    execute(msg, args) {
        console.log(new PermissionsBitField(msg.channel.permissionsFor(msg.guild.roles.everyone)).toArray().join(''));
        return msg.channel.send('hey')
    }
}