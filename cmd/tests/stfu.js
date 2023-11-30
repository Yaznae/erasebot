const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const stfulist = require('../../models/stfulist');

module.exports = {
    name: 'stfu',
    aliases: ['su', 'shutup'],
    reqPerms: [PermissionFlagsBits.ManageMessages],
    guildOnly: true,
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }
        let emb = new EmbedBuilder().setColor('#2b2d31');

        if (!args.length) {
            emb.setDescription(`no **member** was specified .`);
            return msg.channel.send({ embeds: [emb] });
        }

        let list = await stfulist.findOne({ GuildID: msg.guild.id });
        let member;
        if (msg.mentions.users.size) {
            member = msg.mentions.users.first().id
        } else if (!isNum(args[0])) {
            mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
            if (mmbr) member = mmbr.id;
        } else if (isNum(args[0])) {
            member = args[0];
        }

        if (list) {
            if (list.StfuList.includes(member)) {
                let lista = list.StfuList;
                lista.splice(lista.indexOf(member), 1);
                await stfulist.findOneAndUpdate({ GuildID: msg.guild.id }, { StfuList: lista });
                emb.setDescription(`<@${member}> is now **allowed** to talk .`);
                return msg.channel.send({ embeds: [emb] });
            } else {
                let lista = list.StfuList;
                lista.push(member);
                await stfulist.findOneAndUpdate({ GuildID: msg.guild.id }, { StfuList: lista });
                emb.setDescription(`stfu <@${member}> .`);
                return msg.channel.send({ embeds: [emb] });
            }
        } else {
            let lista = [].push(member);
            await stfulist.create({ GuildID: msg.guild.id, StfuList: lista });
            emb.setDescription(`stfu <@${member}> .`);
            return msg.channel.send({ embeds: [emb] });
        }

    }
}