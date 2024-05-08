const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    name: 'serverinfo',
    aliases: ['sinfo'],
    async execute(msg, args) {
        let invBanner = msg.guild.discoverySplashURL({ dynamic: true });
        let banner = msg.guild.bannerURL({ dynamic: true, size: 512 });
        let owner = await msg.guild.fetchOwner();

        // channels
        let textChannels = await msg.guild.channels.cache.filter(c => c.type == ChannelType.GuildText).size;
        let vChannels = await msg.guild.channels.cache.filter(c => c.type == ChannelType.GuildVoice).size;
        let categories = await msg.guild.channels.cache.filter(c => c.type == ChannelType.GuildCategory).size;

        // members
        let members = await msg.guild.members.cache;
        let humans = await members.filter(m => !m.user.bot);
        let bots = await members.filter(m => m.user.bot);

        // misc
        let roles = await msg.guild.roles.cache.size;
        let stickers = await msg.guild.stickers.cache.size;
        let emojis = await msg.guild.emojis.cache.size;

        // make features pretty
        let features = msg.guild.features;
        let pfeats = [];
        features.forEach(f => {
            if (f == 'CHANNEL_ICON_EMOJIS_GENERATED') return;
            let tmp = f.toLowerCase().split('_');
            let tmp2 = [];
            tmp.forEach(s => {
                tmp2.push(s[0].toUpperCase() + s.substr(1));
            });
            pfeats.push(tmp2.join(' '));
        });

        let embed = new EmbedBuilder()
            .setAuthor({ name: msg.guild.name, iconURL: `${msg.member.avatar ? msg.member.displayAvatarURL({ dynamic: true }) : msg.author.displayAvatarURL({ dynamic: true })}` })
            .setThumbnail(msg.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`created <t:${Math.floor(msg.guild.createdTimestamp / 1000)}:R> on <t:${Math.floor(msg.guild.createdTimestamp / 1000)}:f>`)
            .setFields(
                { name: 'design :', value: `\`icon:\` [here](${msg.guild.iconURL({ dynamic: true, size: 1024 })})\n\`banner:\` ${msg.guild.banner ? `[here](`+banner+`)` : `n/a`}\n\`invite banner:\` ${msg.guild.discoverySplash ? `[here](`+invBanner+`)` : `n/a`}`, inline: true },
                { name: 'owner :', value: `@${owner.user.username}\n<@${owner.id}> (${owner.id})`, inline: true },
                { name: 'channels :', value: `\`text:\` ${textChannels}\n\`voice:\` ${vChannels}\n\`categories:\` ${categories}`, inline: true },
                { name: 'members :' , value: `\`humans:\` ${humans.size}\n\`bots:\` ${bots.size}\n\`total:\` ${members.size}`, inline: true },
                { name: 'misc :', value: `\`roles:\` ${roles}\n\`stickers:\` ${stickers}\n\`emojis:\` ${emojis}`, inline: true },
                { name: 'boosts :', value: `level ${msg.guild.premiumTier} (\`${msg.guild.premiumSubscriptionCount}\` boosts)`, inline: true },
                { name: 'features :', value: `${!pfeats.length ? 'n/a' : `\`\`\`\n${pfeats.join(', ')}\n\`\`\``}` }
            )
            .setFooter({ text: `guild id : ${msg.guild.id}` });

        return msg.channel.send({ embeds: [embed] });
    }
}