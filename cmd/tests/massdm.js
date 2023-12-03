const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'massdm',
    aliases: ['mdm'],
    ownerOnly: true,
    async execute(msg, args) {
        let emb = new EmbedBuilder().setColor('#2b2d31')

        if (!args.length) {
            emb.setDescription(`no **message** was provided .`);
            return msg.reply({ embeds: [emb] });
        }
        emb.setDescription(`initiating **mass dm** ...`)
        let res = await msg.channel.send({ embeds: [emb] });
        let members = await msg.guild.members.fetch().then(members => members.forEach(async memb => {
            try {
                await memb.send(args.join(' '));
                return console.log(`# sent DM to @${memb.user.username}`);
            } catch (e) {
                console.log(`# couldn't DM @${memb.user.username}`);
                console.log(e);
            }
        })).then(() => {
            emb.setDescription(`mass dm **completed** .`)
            return res.channel.send({ embeds: [emb] });
        });

    }
}