const { Events } = require('discord.js');
const avhistory = require('../models/avh');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    async execute(oldMem, newMem) {
        if (newMem.avatar !== oldMem.avatar) {
            let avh = await avhistory.findOne({ MemberID: newMem.id });
            if (!avh) {
                await avhistory.create({ MemberID: newMem.id, AvatarHistory: [].push(`${newMem.displayAvatarURL({ size: 2048, dynamic: true })}#${Math.floor(Date.now()/1000)}`) });
            } else {
                let list = avh.AvatarHistory;
                if (list.length == 10) list.shift();
                list.push(`${newMem.displayAvatarURL({ size: 2048, dynamic: true })}#${Math.floor(Date.now() / 1000)}`);
                await avhistory.findOneAndReplace({ MemberID: newMem.id }, { MemberID: newMem.id, AvatarHistory: list });
            };
        }
    },
};