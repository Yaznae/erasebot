const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require('node:fs');
const prefix = require('../../models/info');

module.exports = {
    name: 'prefix',
    guildOnly: true,
    async execute(msg, args) {
        let data = await prefix.findOne({ GuildID: msg.guild.id });

        let emb = new EmbedBuilder()
            .setColor('#2b2d31')

        if (!args.length) {
            if (!data) {
                emb.setDescription(`**server prefix**: \`${process.env.PREFIX}\``);
                await msg.channel.send({ embeds: [emb] });
                return prefix.create({ GuildID: msg.guild.id, Prefix: process.env.PREFIX });
            } else {
                emb.setDescription(`**server prefix**: \`${data.Prefix}\``);
                return msg.channel.send({ embeds: [emb] });
            }

        } else {
            if (msg.member.permissions.has(PermissionFlagsBits.Administrator)) {
                let pfx = data ? data.Prefix : process.env.PREFIX;

                const subcmd = args.shift();
                switch (subcmd) {
                    case 'set':
                        if (!args.length) {
                            emb.setAuthor({ name: 'invalid usage !' }).addFields({ name: 'usage :', value: `\`${pfx}prefix set [prefix]\`\n\n**example :**\n\`${pfx}prefix set ,\`` });
                            return msg.channel.send({ embeds: [emb] });
                        } else {
                            if (data) {
                                await prefix.findOneAndUpdate({ GuildID: msg.guild.id }, { Prefix: args[0] });
                            } else {
                                await prefix.create({ GuildID: msg.guild.id, Prefix: args[0] });
                            }
                            emb.setDescription(`set **server prefix** to: \`${args[0]}\``);
                            return msg.channel.send({ embeds: [emb] });
                        }

                    case 'reset':
                        if (data) {
                            await prefix.findOneAndUpdate({ GuildID: msg.guild.id }, { Prefix: process.env.PREFIX });
                        } else {
                            await prefix.create({ GuildID: msg.guild.id, Prefix: process.env.PREFIX });
                        }

                        emb.setDescription(`reset **server prefix** back to: \`${process.env.PREFIX}\``);
                        return msg.channel.send({ embeds: [emb] });
                    default:
                        emb.setDescription(`**server prefix**: \`${pfx}\``);
                        return msg.channel.send({ embeds: [emb] });
                }
            } else {
                emb.setDescription(`you lack the **permissions** to use this command:\n\`Administrator\``)
                return msg.reply({ embeds: [emb] });
            }
        }
    }
}