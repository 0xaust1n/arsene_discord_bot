module.exports = {
  name: 'ping',
  description: 'this is a ping command!',
  execute(msg, args, client) {
    const emoji = client.emojis.cache.get('738680578974548038');
    msg.reply(`Pong! Mother Fucker ${emoji}`);
  },
};
