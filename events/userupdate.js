const { Events } = require('discord.js');
const avhistory = require('../models/avh');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    async execute(oldMem, newMem) {
        if (oldMem.partial) await oldMem.fetch(true);
        await newMem.fetch(true);

        if (newMem.avatar !== oldMem.avatar) {
            let avh = await avhistory.findOne({ MemberID: newMem.id });
            if (!avh) {
                console.log(newMem.displayAvatarURL({ size: 2048, dynamic: true }));
                await avhistory.create({ MemberID: newMem.id, AvatarHistory: [`${newMem.displayAvatarURL({ size: 2048, dynamic: true })}#${Math.floor(Date.now()/1000)}`] });
            } else {
                let list = avh.AvatarHistory;
                if (list.includes(1)) list = list.filter(e => e !== 1);
                if (list.length == 10) list.pop();
                list.unshift(`${newMem.displayAvatarURL({ size: 2048, dynamic: true })}#${Math.floor(Date.now() / 1000)}`);
                await avhistory.findOneAndReplace({ MemberID: newMem.id }, { MemberID: newMem.id, AvatarHistory: list });
            };
        }
    },
};