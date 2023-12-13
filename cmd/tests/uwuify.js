const uwuifier = require('uwuifier');
const uwulist = require('../../models/uwu');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'uwuify',
    aliases: ['uwu'],
    ownerOnly: true,
    async execute(msg, args) {
        function isNum(str) {
            return /^\d+$/.test(str);
        }

        let embed = new EmbedBuilder().setColor('#2b2d31');

        let member;


        if (msg.mentions.users.size) {
            member = msg.mentions.users.first().id
        } else if (!isNum(args[0])) {
            mmbr = await msg.guild.members.cache.find((usr) => usr.user.username.toLowerCase().startsWith(args[0]));
            if (mmbr) member = mmbr.id;
        } else if (isNum(args[0])) {
            member = args[0];
        };

        let uwu = await uwulist.findOne({ ChannelID: msg.channel.id });
        let memb = await msg.guild.members.cache.get(member);
        let user = await msg.guild.members.fetch(member);

        if (!args.length) {
            if (!uwu || !uwu.UwuList) {
                embed.setDescription(`> this server **does not** have an **uwu-list** .`);
                return msg.channel.send({ embeds: [embed] });
            } else {

            let list = uwu.UwuList;

            let mentions = [];
            list.forEach(m => {
                mentions.push(`<:tailarrow:1181760833458556938> <@${m}>`);
            });

            embed.setAuthor({ name: 'uwu-list members :' });
            embed.setDescription(mentions.join('\n'));
            embed.setFooter({ text: `${mentions.length} members` });
            return msg.channel.send({ embeds: [embed] });
            }
        } else if (!memb) {
            embed.setDescription(`> invalid **member** provided .`);
            return msg.channel.send({ embeds: [embed] });
        }

        if (!uwu) {
            let webhook = await msg.channel.createWebhook({
                name: 'uwuifer //erasebot',
                reason: 'fun'
            });
            await uwulist.create({ ChannelID: msg.channel.id, Webhook: webhook.url, UwuList: [member] });
            embed.setDescription(`> added <@${member}> to the **uwu-list** .`);
            return msg.channel.send({ embeds: [embed] });
        } else {
            let list = uwu.UwuList;
            if (list.includes(member)) {
                list.splice(list.indexOf(member), 1);
                await uwulist.findOneAndUpdate({ ChannelID: msg.channel.id }, { UwuList: list });
                embed.setDescription(`> removed <@${member}> from the **uwu-list** .`);
                return msg.channel.send({ embeds: [embed] });
            } else {
                list.push(member);
                await uwulist.findOneAndUpdate({ ChannelID: msg.channel.id }, { UwuList: list });
                embed.setDescription(`> added <@${member}> to the **uwu-list** .`);
                return msg.channel.send({ embeds: [embed] });
            }
        };
    },
};