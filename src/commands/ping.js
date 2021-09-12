module.exports = {
  name: 'ping',
  description: 'this is a ping command!',
  execute(msg, args) {
    msg.channel.send(`Pong! Mother Fucker`);
  },
};
