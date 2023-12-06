const { Events } = require('discord.js');
const avhistory = require('../models/avh');
const { ImgurClient } = require('imgur');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    async execute(oldMem, newMem) {
        if (oldMem.partial) await oldMem.fetch(true);
        await newMem.fetch(true);

        if (newMem.avatar !== oldMem.avatar) {
            let imgur = new ImgurClient({ accessToken: process.env.ACCESS_TOKEN });
            let avh = await avhistory.findOne({ MemberID: newMem.id });
            if (!avh) {
                console.log(newMem.displayAvatarURL({ size: 2048, dynamic: true }));
                let url;
                if (newMem.avatar.startsWith('a_')) { url = newMem.displayAvatarURL({ dynamic: true, size: 1024 }); } else { url = newMem.displayAvatarURL({ extension: 'png', size: 1024 }); };

                let postimg = await imgur.upload({ image: url, title: `${newMem.avatar}`, description: `erase bot avatar history for ${newMem.username}` });
                let res = postimg.data;

                await avhistory.create({ MemberID: newMem.id, AvatarHistory: [`${res.link}#${Math.floor(Date.now() / 1000)}`] });
            } else {
                let list = avh.AvatarHistory;
                if (list.includes(1)) list = list.filter(e => e !== 1);
                if (list.length == 10) list.pop();

                let url;
                if (newMem.avatar.startsWith('a_')) { url = newMem.displayAvatarURL({ dynamic: true, size: 1024 }); } else { url = newMem.displayAvatarURL({ extension: 'png', size: 1024 }); };
                
                let postimg = await imgur.upload({ image: url, title: `${newMem.avatar}`, description: `erase bot avatar history for ${newMem.username}` });
                let res = postimg.data;

                list.unshift(`${res.link}#${Math.floor(Date.now() / 1000)}`);
                await avhistory.findOneAndReplace({ MemberID: newMem.id }, { MemberID: newMem.id, AvatarHistory: list });
            };
        }
    },
};