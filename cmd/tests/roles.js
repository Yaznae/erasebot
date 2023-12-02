const { PermissionsBitField, EmbedBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'roles',
    guildOnly: true,
    async execute(msg, args) {
        let roles = [];
        let positions = [];
        let rShow = [];
        let i = 1;
        let desc = ``;
        let descs = [];

        let larrow = new ButtonBuilder()
            .setEmoji('<:leftarrow1:1179900394772639744>')
            .setCustomId('rlsleft')
            .setStyle(ButtonStyle.Secondary);
        let rarrow = new ButtonBuilder()
            .setEmoji('<:rightarrow1:1179900396592955442>')
            .setCustomId('rlsright')
            .setStyle(ButtonStyle.Secondary);
        let cancel = new ButtonBuilder()
            .setEmoji('<:cancel:1179902695881052311>')
            .setCustomId('rlscancel')
            .setStyle(ButtonStyle.Secondary)

        msg.guild.roles.cache.forEach(r => positions.push(r.position));
        positions.sort((a, b) => b - a)
        await positions.forEach(async pos => {
            let role = await msg.guild.roles.cache.find(r => r.position == pos);
            roles.push(role.id);
        });
        if (roles.length > 10) rShow = roles.splice(0, 10);
        rShow.forEach(rol => {
            desc += `\`${i}\` : <@&${rol}>\n`;
            i++
        });

        larrow.setDisabled(true);
        let emb = new EmbedBuilder().setColor('#2b2d31').setAuthor({ name: 'list of all roles :' });
        let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);

        if (positions.length <= 10) { emb.setFooter({ text: `${positions.length}/${positions.length} roles` }) } else { emb.setFooter({ text: `10/${positions.length} roles` }) };
        emb.setDescription(desc)
        let res = await msg.channel.send({ embeds: [emb], components: [row] });

        try {
            let roleList = await res.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000, message: res });
            let rIndx = 10;
            let tIndx = 0;
            let dIndx = 0;

            roleList.on('collect', async intr => {
                if (intr.user.id !== msg.author.id) return intr.deferUpdate();

                if (intr.customId == 'rlsright') {
                    await intr.deferUpdate();
                    larrow.setDisabled(false);
                    let amnt = roles.length > 10 ? 10 : roles.length
                    if (!descs[dIndx]) descs.push(desc);

                    rIndx += 10;
                    dIndx += 1;
                    console.log(dIndx)
                    if (rIndx >= positions.length) { rarrow.setDisabled(true); tIndx = positions.length } else { tIndx = rIndx };
                    if (!descs[dIndx]) {
                        desc = ``;
                        rShow = roles.splice(0, amnt);
                        rShow.forEach(rol => {
                            desc += `\`${i}\` : <@&${rol}>\n`;
                            i++
                        });
                        console.log(dIndx)
                        descs.push(desc)
                        emb.setFooter({ text: `${tIndx}/${positions.length} roles` }).setDescription(desc);
                        return res.edit({ embeds: [emb], components: [row] });
                    } else {
                        console.log(dIndx)
                        emb.setFooter({ text: `${tIndx}/${positions.length} roles` }).setDescription(descs[dIndx]);
                        return res.edit({ embeds: [emb], components: [row] });
                    };

                } else if (intr.customId == 'rlsleft') {
                    await intr.deferUpdate();
                    dIndx -= 1;
                    console.log(dIndx);
                    rIndx -= 10;
                    desc = descs[dIndx];
                    emb.setFooter({ text: `${rIndx}/${positions.length} roles` }).setDescription(desc);
                    if (rIndx == 10) larrow.setDisabled(true);
                    rarrow.setDisabled(false);
                    return res.edit({ embeds: [emb], components: [row] });
                } else if (intr.customId == 'rlscancel') {
                    await intr.deferUpdate();
                    try {
                        res.edit({ embeds: [emb], components: [] });
                        return roleList.stop();
                    } catch (e) { console.error(e) };
                }
            });

            roleList.on('end', async intr => {
                try {
                    console.log('end')
                    res.edit({ embeds: [emb], components: [] });
                    return roleList.stop();
                } catch (e) { console.error(e) };
            })
        } catch (err) {
            await res.edit({ embeds: [emb], components: [] });
            console.error(err);
        }
    }
}