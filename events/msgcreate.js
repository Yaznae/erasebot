const { Events, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const info = require('../models/info');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(msg) {
        if (msg.guild == null) return;

        const data = await info.findOne({ GuildID: msg.guild?.id });
        let pfx1 = data ? data.Prefix : process.env.PREFIX;
        let pfx = msg.content.startsWith(`<@${msg.client.user.id}>`) ? `<@${msg.client.user.id}>` : pfx1;

        const ownerIDs = ['931514266815725599', '1165580003354890312'];

        if (!msg.content.startsWith(pfx) || msg.author.bot) return;

        const args = msg.content.slice(pfx.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = msg.client.commands.get(cmdName) || msg.client.commands.find(command => command.aliases && command.aliases.includes(cmdName));

        if (!cmd) return;

        if (cmd.ownerOnly) {
            if (!ownerIDs.includes(msg.author.id)) return;
        };

        if (cmd.reqPerms) {
            let perms = new PermissionsBitField(cmd.reqPerms).toArray();
            let emb = new EmbedBuilder().setColor('#2b2d31')
                .setDescription(`you lack the **permissions** to use this command:\n\`${perms.join('`, `')}\``);
            if (!msg.member.permissions.has(cmd.reqPerms) && cmd.boosterCmd) {
                if (msg.member.premiumSince == null) {
                    return msg.reply({ embeds: [emb] });
                }
            } else if (!msg.guild.members.me.permissions.has(cmd.reqPerms)) {
                emb.setDescription(`i lack the **permissions** to use this command:\n\`${perms.join('`, `')}\``)
                return msg.reply({ embeds: [emb] });
            }
        } else if (cmd.boosterCmd) {
            if (msg.member.premiumSince == null) {
                let emb = new EmbedBuilder().setColor('#2b2d31')
                    .setDescription(`this is a **booster-only** command .`);
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