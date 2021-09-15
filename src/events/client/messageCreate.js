const prefix = '!';

module.exports = {
  name: 'messageCreate',
  once: false,
  execute(msg, client) {
    if (!msg.content.startsWith(prefix) || msg.author.bot) {
      return; //escape the function
    }
    //seeking command
    const arg = msg.content.slice(prefix.length).split(/ +/);
    const cmd = arg.shift().toLocaleLowerCase(); //shift first element
    const command = client.commands.get(`${cmd}`) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));
    if (command) {
      command.execute(msg, arg, client);
    }
  },
};
