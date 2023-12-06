const { PermissionsBitField } = require("discord.js");
const fs = require('node:fs');
const https = require('node:https');

module.exports = {
    name: 'spfp',
    aliases: ['savepfp'],
    ownerOnly: true,
    async execute(msg, args) {
        let download = function(url, dest, cb) {
            let file = fs.createWriteStream(dest);
            let request = https
                .get(url, function (res) {
                    res.pipe(file);
                    file.on('finish', function () {
                        file.close(cb);
                    });
                })
                .on('error', function (err) {
                    fs.unlink(dest);
                    if (cb) cb(err.message);
                });

            request.on('error', function (err) {
                console.log(err);
            });
        };

        let url = msg.mentions.users.first().displayAvatarURL({ dynamic: true, size: 1024 });
        await fs.mkdir(`${__dirname}\\..\\..\\avatars\\${msg.mentions.users.first().id}`, function (e) {
            if (e) {
                console.log(e);
            } else {
                download(url, `${__dirname}\\..\\..\\avatars\\${msg.mentions.users.first().id}\\${msg.mentions.users.first().avatar}.png`, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        return msg.channel.send('done');
                    }
                });
            }
        });
        
    }
}