const { PermissionsBitField, Embed, EmbedBuilder, AttachmentBuilder, Attachment, PermissionFlagsBits } = require("discord.js");
const info = require('../../models/apfp');
const ms = require('ms');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    name: 'randompfps',
    aliases: ['autopfps'],
    guildOnly: true,
    reqPerms: [PermissionFlagsBits.Administrator],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        let pfpDetails = await info.findOne({ GuildID: msg.guild.id });

        let channelID;
        let channelName;

        if (!args.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31')
            if (pfpDetails) { emb.setDescription(`**autopfp channel**: <#${pfpDetails.ChannelID}>`) } else { emb.setDescription(`this server does not have an **autopfp channel** set .`) };
            return msg.channel.send({ embeds: [emb] });
        };


        let subcmd = args.shift();

        switch (subcmd) {
            case 'set':
                if (!args.length) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`no **channel** was provided .`);
                    return msg.channel.send({ embeds: [emb] });
                }  else {
                    if (msg.mentions.channels.size) {
                        channelID = msg.mentions.channels.first().id
                    } else if (!isNum(args[0])) {
                        let chnl = await msg.guild.channels.cache.find((channel) => channel.name.toLowerCase().startsWith(args[0]));
                        if (chnl) channelID = chnl.id;
                    } else if (isNum(args[0])) {
                        channelID = args[0];
                    }

                    let pfpChannel = await msg.guild.channels.cache.get(channelID);
                    if (!pfpChannel) {
                        let emb = new EmbedBuilder().setColor('#2b2d31');
                        emb.setDescription(`no **channel** was found .`);
                        return msg.channel.send({ embeds: [emb] });
                    } else {
                        if (!pfpDetails) {
                            await info.create({ GuildID: msg.guild.id, ChannelID: channelID, Up: false });
                        } else {
                          if (pfpDetails.Up) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`autopfp is **still running**, please **stop it** first .`);
                    return msg.reply({ embeds: [emb] });
                }
                            await info.findOneAndUpdate({ GuildID: msg.guild.id }, { ChannelID: channelID });
                        }
                        let emb = new EmbedBuilder().setColor('#2b2d31');
                        emb.setDescription(`set **autopfp channel** to <#${channelID}> .`);
                        return msg.channel.send({ embeds: [emb] });
                    }
                };

            case 'start':
                if (!pfpDetails) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`this server does not have an **autopfp channel** set .`);
                    return msg.channel.send({ embeds: [emb] });
                }
                if (pfpDetails.Up) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`autopfp is **already running** .`);
                    return msg.reply({ embeds: [emb] });
                } else {
                    await info.findOneAndUpdate({ GuildID: msg.guild.id }, { Up: true });
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`initiated **autopfp** .`);
                    return msg.reply({ embeds: [emb] });
                }

            case 'stop':
                if (!pfpDetails) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`this server does not have an **autopfp channel** set .`);
                    return msg.channel.send({ embeds: [emb] });
                }
                if (!pfpDetails.Up) {
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`autopfp is **already stopped** .`);
                    return msg.reply({ embeds: [emb] });
                } else {
                    await info.findOneAndUpdate({ GuildID: msg.guild.id }, { Up: false });
                    let emb = new EmbedBuilder().setColor('#2b2d31');
                    emb.setDescription(`stopped **autopfp** .`);
                    return msg.reply({ embeds: [emb] });
                }

            default:
                let emb = new EmbedBuilder().setColor('#2b2d31')
                if (channelID) { emb.setDescription(`**autopfp channel**: <#${channelID}>`) } else { emb.setDescription(`this server does not have an **autopfp channel** set .`) };
                return msg.channel.send({ embeds: [emb] });
        };
    }
}