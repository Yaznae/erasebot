module.exports = {
    name: 'test',
    aliases: ['tst'],
    ownerOnly: true,
    execute(msg, args) {
        console.log(msg.member.premiumSince);
        return msg.channel.send('hey')
    }
}