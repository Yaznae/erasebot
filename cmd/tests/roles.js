
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    name: 'roles',
    guildOnly: true,
    async execute(msg, args) {
        let roles = [];
        let i = 1;
        let rolPos = await msg.guild.roles.cache.map(role => role.position).sort();
        for (const r in rolPos.reverse()) {
            let rol = await msg.guild.roles.cache.find(role => role.position == r)
            roles.push(rol.id);
        }
        console.log(roles.reverse());
        let lngth = roles.length;

        let emb = new EmbedBuilder().setColor('#2b2d31');
        let res;
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

        if (!lngth) { emb.setDescription(`this server has **no roles** .`); return msg.channel.send({ embeds: [emb] }); }

        emb.setAuthor({ name: 'list of all roles :' });
        let show = roles.splice(0, lngth >= 10 ? 10 : lngth);
        let descs = [];
        let desc = ``;
        show.forEach(showing => {
            desc += (`\`${i}\` : <@&${showing}>\n`)
            i++
        });
        descs.push(desc)
        emb.setDescription(desc);
        emb.setFooter({ text: `${i - 1}/${lngth} roles` })
        larrow.setDisabled(true);
        console.log(roles.length);
        if (roles.length < 10) { rarrow.setDisabled(true); }

        let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);

        res = await msg.channel.send({ embeds: [emb], components: [row] });

        try {
            const nextAV = await res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });
            let indx = 10;
            let desci = 1;
            let tindx = 0;
            let prevdsc = ``;
            nextAV.on('collect', async intr => {
                if (intr.user.id !== msg.author.id) return;
                if (intr.customId == 'rlsleft') {
                    intr.deferUpdate();
                    indx -= 10;
                    desci -= 1;
                    console.log(descs[desci]);
                    desc = prevdsc;
                    if (indx <= 10) larrow.setDisabled(true);
                    if (indx > lngth) { tindx = lngth };
                    emb.setDescription(descs[desci]);
                    emb.setFooter({ text: `${indx > lngth ? tindx : indx}/${lngth} roles` });
                    let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                    try {
                        await res.edit({ embeds: [emb], components: [row] });
                    } catch (e) { console.error(e) };
                } else if (intr.customId == 'rlsright') {
                    intr.deferUpdate();
                    prevdsc = desc;
                    indx += 10;
                    let amt = lngth >= 10 ? 10 : lngth
                    let h = roles.splice(0, amt);
                    let show2 = h;
                    desc = ``;
                    show2.forEach(showing2 => { desc += `\`${i}\` : <@&${showing2}>\n`; i++; });
                    if (descs.length <= 1) descs.push(desc);
                    larrow.setDisabled(false);
                    if (indx >= lngth) { tindx = lngth };
                    if (tindx == lngth) rarrow.setDisabled(true);
                    console.log(descs);
                    emb.setDescription(desc);
                    emb.setFooter({ text: `${indx > lngth ? tindx : indx}/${lngth} roles` });
                    let row = new ActionRowBuilder().addComponents(larrow, rarrow, cancel);
                    try {
                        await res.edit({ embeds: [emb], components: [row] });
                    } catch (e) { console.error(e) };
                } else if (intr.customId == 'rlscancel') {
                    intr.deferUpdate();
                    try {
                        return res.edit({ embeds: [emb], components: [] });
                    } catch (e) { console.error(e) };
                }
            })

            nextAV.on('end', intr => {
                try {
                    return res.edit({ embeds: [emb], components: [] });
                } catch (e) { console.error(e) };
            })
        } catch (err) {
            await res.edit({ embeds: [emb], components: [] });
        }
    }
}
