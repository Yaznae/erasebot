const { EmbedBuilder } = require("discord.js");
const fs = require('node:fs');

module.exports = {
    name: 'reload',
    aliases: ['rel'],
    ownerOnly: true,
    async execute(msg, args) {
        let cmds = [];
        let errs = [];
        console.log(args)
        args.forEach(arg => {
            console.log(arg)
            const cmdName = arg.toLowerCase();
            const cmd = msg.client.commands.get(cmdName) || msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            if (!cmd) {
                let emb = new EmbedBuilder().setColor("#2b2d31").setDescription(`there is no **command** with the name \`${cmdName}\` .`)
                return msg.reply({ embeds: [emb] });
            }

            const cFolders = fs.readdirSync('./cmd');
            const fName = cFolders.find(folder => fs.readdirSync(`./cmd/${folder}`).includes(`${cmd.name}.js`));

            delete require.cache[require.resolve(`../${fName}/${cmd.name}.js`)];

            try {
                const newCmd = require(`../${fName}/${cmd.name}.js`);
                msg.client.commands.set(newCmd.name, newCmd);
                return cmds.push(newCmd.name)
            } catch (err) {
                console.error(err);
                return errs.push(cmdName)
            };
        })
        if (cmds.length) {
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`the following commands were **reloaded** successfully :\n\`${cmds.join('`, `')}\``);
            await msg.channel.send({ embeds: [emb] });
        }
        if (errs.length) {
            let emb2 = new EmbedBuilder().setColor('#2b2d31').setDescription(`there were **problems** reloading the following commands :\n\`${errs.join('`, `')}\``);
            return msg.channel.send({ embeds: [emb2] });
        };
    },
};