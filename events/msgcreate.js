const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const pfx = '.';

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(msg) {
        const ownerIDs = ['931514266815725599'];

        if (!msg.content.startsWith(pfx) || msg.author.bot) return;

        const args = msg.content.slice(pfx.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = msg.client.commands.get(cmdName) || msg.client.commands.find(command => command.aliases && command.aliases.includes(cmdName));

        if (!cmd) return;

        if (cmd.ownerOnly) {
            if (!ownerIDs.includes(msg.author.id)) return;
        };

        if (cmd.reqPerms) {
            if (!msg.member.permissions.has(cmd.reqPerms)) {
                let perms = new PermissionsBitField(cmd.reqPerms).toArray();
                let emb = new EmbedBuilder().setColor('#2b2d31')
                    .setDescription(`you lack the **permissions** to use this command:\n\`${perms.join('`, `')}\``)
                return msg.reply({ embeds: [emb] });
            }
        }

        try {
            await cmd.execute(msg, args);
        } catch (err) {
            console.error(err);
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription('there was an **error** executing this command .');
            await msg.reply({ embeds: [emb] });
        }
    },
};