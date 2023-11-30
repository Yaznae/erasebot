const { Events } = require('discord.js');

module.exports = {
    name: Events.PresenceUpdate,
    once: false,
    async execute(oldMem, newMem) {
        let vanity = '/erase'
        let role = '1179571138628694128';
        let member = newMem.member;
        const status = newMem.activities.find(activity => activity.type == 4)?.state;

        if (!newMem.guild.id !== '1168276307151425627') return;

        if (!member.roles.cache.has(role)) {
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