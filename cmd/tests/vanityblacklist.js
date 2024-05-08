const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
let sInfo = require('../../models/info');

module.exports = {
    name: 'vanityblacklist',
    aliases: ['vbl'],
    guildOnly: true,
    reqPerms: [PermissionFlagsBits.Administrator],
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        let emb = new EmbedBuilder().setColor('#2b2d31')

        let member;

        if (msg.mentions.users.size) {
            member = msg.mentions.users.first().id
        } else if (!isNum(args[0])) {
            mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
            if (mmbr) member = mmbr.id;
        } else if (isNum(args[0])) {
            member = args[0];
        };

        let user = await msg.guild.members.cache.get(member);
        let role = '1179970472771854437';


        let info = await sInfo.findOne({ GuildID: msg.guild.id });

        if (!args.length) {
            if (!info || !info.BlackList || !info.BlackList.length) {
                emb.setDescription(`> this server has no **blacklisted members** .`);
                return msg.channel.send({ embeds: [emb] });
            } else {
                let list = info.BlackList;
                let mentions = [];
                list.forEach(id => mentions.push(`<:tailarrow:1181760833458556938> <@${id}>`));
                emb.setAuthor({ name: 'list of blacklisted members :' });
                emb.setDescription(`${mentions.join('\n')}`);
                emb.setFooter({ text: `${list.length} user${list.length == 1 ? '' : 's'}` });
                return msg.channel.send({ embeds: [emb] });
            }
        }

        if (!user) {
            emb.setDescription(`> invalid **member** passed .`)
            return msg.channel.send({ embeds: [emb] });
        }

        if (!info) {
            await sInfo.create({ GuildID: msg.guild.id, Prefix: process.env.PREFIX, BlackList: [member] });
            emb.setDescription(`> <@${member}> was added to the **vanity blacklist** .`);

            if (user.roles.cache.has(role)) {
                try {
                    await user.roles.remove(role);
                } catch (err) {
                    console.error(err);
                }
            }

            return msg.channel.send({ embeds: [emb] });
        } else if (!info.BlackList) {
            await sInfo.findOneAndUpdate({ GuildID: msg.guild.id }, { BlackList: [member] });

            if (user.roles.cache.has(role)) {
                try {
                    await user.roles.remove(role);
                } catch (err) {
                    console.error(err);
                }
            }

            emb.setDescription(`> <@${member}> was added to the **vanity blacklist** .`);
            return msg.channel.send({ embeds: [emb] });
        } else {
            let bl = info.BlackList;
            if (bl.includes(member)) {
                bl.splice(bl.indexOf(member), 1);
                await sInfo.findOneAndUpdate({ GuildID: msg.guild.id }, { BlackList: bl });
                emb.setDescription(`> <@${member}> was removed from the **vanity blacklist** .`);
                return msg.channel.send({ embeds: [emb] });
            } else {
                bl.push(member);
                await sInfo.findOneAndUpdate({ GuildID: msg.guild.id }, { BlackList: bl });
                emb.setDescription(`> <@${member}> was added to the **vanity blacklist** .`);

                if (user.roles.cache.has(role)) {
                    try {
                        await user.roles.remove(role);
                    } catch (err) {
                        console.error(err);
                    }
                }

                return msg.channel.send({ embeds: [emb] });
            }
        }

    }
}