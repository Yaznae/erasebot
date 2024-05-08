const { Events, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const info = require('../models/info');
const afklist = require('../models/afk');
const ms = require('ms');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(msg) {
        if (msg.guild == null) return;

        const data = await info.findOne({ GuildID: msg.guild?.id });
        let pfx1 = data ? data.Prefix : process.env.PREFIX;
        let pfx = msg.content.startsWith(`<@${msg.client.user.id}>`) ? `<@${msg.client.user.id}>` : pfx1;

        const ownerIDs = ['931514266815725599', '231317222088376320'];

        if (msg.mentions.users.size) {
            let afkPing = await afklist.findOne({ MemberID: msg.mentions.users.first().id });
            if (afkPing) {
                let guilds = afkPing.Guilds;
                let usr = afkPing.MemberID;
                let search = guilds.filter(g => g.startsWith(msg.guild.id));
                if (search.length) {
                    let info = search[0].split('#');
                    let time = parseInt(info[1]);
                    let reason = info[2];
                    let embed = new EmbedBuilder().setColor('#2b2d31').setDescription(`> :zzz: <@${msg.author.id}>: <@${usr}> is AFK: **${reason}** - \`${ms(Date.now() - time, { long: true })}\` .`);
                    try {
                        return msg.reply({ embeds: [embed] });
                    } catch (e) {
                        console.error(e);
                        return msg.channel.send({ embeds: [embed] });
                    }
                }
            }
        }

        let afk = await afklist.findOne({ MemberID: msg.author.id });
        if (afk) {
            let guilds = afk.Guilds;
            let search = guilds.filter(g => g.startsWith(msg.guild.id));
            if (search.length) {
                if (msg.content.startsWith(`${pfx}afk`)) return;
                let x = guilds.splice(guilds.indexOf(search[0]), 1);
                let time = parseInt(search[0].split('#')[1]);
                await afklist.findOneAndReplace({ MemberID: msg.author.id }, { MemberID: msg.author.id, Guilds: guilds });
                let embed = new EmbedBuilder().setColor('#2b2d31').setDescription(`> <@${msg.author.id}>: welcome back, you were away for **${ms(Date.now() - time, { long: true })}** .`);
                try {
                    return msg.reply({ embeds: [embed] });
                } catch (e) {
                    console.error(e);
                    return msg.channel.send({ embeds: [embed] });
                }
            }
        }

        if (msg.guild.id == '1235012141061378129') {
            if (msg.content.includes('pic perm')) {
                let emb = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setDescription(`**boost** or **rep** \`/erase\` 4 pic`)
                return msg.reply({ embeds: [emb] })
            }
        }

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