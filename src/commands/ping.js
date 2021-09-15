module.exports = {
  name: 'ping',
  description: 'this is a ping command!',
  execute(msg) {
    msg.channel.send(`Pong! Mother Fucker`);
  },
};
