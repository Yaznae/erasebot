const { EmbedBuilder } = require("discord.js");
const fs = require('node:fs');

module.exports = {
    name: 'reload',
    aliases: ['rel'],
    ownerOnly: true,
    async execute(msg, args) {
        const cmdName = args[0].toLowerCase();
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
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`command \`${newCmd.name}\` was **reloaded** successfully .`)
            return msg.channel.send({ embeds: [emb] });
        } catch (err) {
            console.error(err);
            let emb = new EmbedBuilder().setColor('#2b2d31').setDescription(`there was a **problem** trying to reload command \`${cmdName}\` .`);
            return msg.channel.send({ embeds: [emb] })
        };
    },
};