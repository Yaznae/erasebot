module.exports = {
  name: "grabip",
  ownerOnly: true,
  async execute(msg, args) {
    if (!msg.mentions.users.size) return;

    const usr = msg.mentions.users.first();

    msg.channel.send(`\`Grabbing IP of @${usr.tag} (${usr.id}).\``).then((masg) => {
      let dots = ["..", "...", ".", ".."];
      let i = 0;
      let thing = setInterval(() => {
        masg.edit(`\`Grabbing IP of @${usr.tag} (${usr.id})${dots[i]}\``);
        i++
        if (i === 4) {
          masg.edit(`\`IP of @${usr.tag} is 192.168.${Math.floor(Math.random() * 251)}.${Math.floor(Math.random() * 251)}\``)
          clearInterval(thing);
        }
      }, 700)
    })
  }
}