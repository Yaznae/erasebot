const { Events } = require('discord.js');
const sInfo = require('../models/info');

module.exports = {
    name: Events.PresenceUpdate,
    once: false,
    async execute(oldMem, newMem) {
        let vanity = '/erase'
        let role = '1179970472771854437';
        let member = newMem.member;
        const status = newMem.activities.find(activity => activity.type == 4)?.state;
        console.log(status);

        if (newMem.guild.id !== '1235012141061378129') return;

        await newMem.guild.members.fetch(newMem.id);
        let info = await sInfo.findOne({ GuildID: '1235012141061378129' });
        if (!info) {
            return
        };
        let list = info.BlackList;

        if (list.includes(newMem.user.id)) {
            return console.log(`# ${newMem.user.username} (${newMem.user.id}) is blacklisted !!`)
        };

        if (!member.roles.cache.has(role) && !list.includes(newMem.user.id)) {
            if (status && status.includes(vanity)) {
                try {
                    member.roles.add(role);
                } catch (err) {
                    console.error(err);
                };
            }
        } else {
            if (!status || !status.includes(vanity)) {
                try {
                    member.roles.remove(role);
                } catch (err) {
                    console.error(err);
                };
            };
        };
    },
};