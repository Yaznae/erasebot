module.exports = {
    name: 'test',
    aliases: ['tst'],
    execute(msg, args) {
        return msg.channel.send('hey')
    }
}