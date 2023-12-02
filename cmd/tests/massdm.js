const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'massdm',
    aliases: ['mdm'],
    ownerOnly: true,
    async execute(msg, args) {
        let emb = new EmbedBuilder().setColor('#2b2d31')
        if (!args.length) {
            emb.setDescription(`no **server ID** was provided .`);
            return msg.reply({ embeds: [emb] });
        }

        let serv = await msg.client.guilds.cache.get(args.shift());
        if (!serv) {
            emb.setDescription(`i am **not** in that server .`);
            return msg.reply({ embeds: [emb] });
        } else {
            if (!args.length) {
                emb.setDescription(`no **message** was provided .`);
                return msg.reply({ embeds: [emb] });
            }
            let members = await serv.members.fetch();
            console.log(members.length);
            let i = 0;
            for (const memb in members) {
                try {
                    let memberDM = memb.createDM();
                    await memberDM.send(args.join(' '));
                    console.log(`# sent DM to @${memb.user.username}`);
                    i += 1;
                } catch (e) {
                    console.log(`# couldn't DM @${memb.user.username}`);
                    i += 1;
                }
            }
            if (i == members.length) {
                emb.setDescription(`mass dm **completed** .`)
                return msg.channel.send({ embeds: [emb] });
            }
        }
    }
}