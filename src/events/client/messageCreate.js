const { Permissions } = require('discord.js');
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
    // check command is exist or not
    if (command) {
      //check permission before execute
      let isInvalid = false;
      if (command.prems) {
        for (const prem of command.prems) {
          if (!msg.member.permissions.has(Permissions.FLAGS[prem])) {
            isInvalid = true;
            break;
          }
        }
      }
      if (isInvalid) {
        return msg.channel.send(`你沒有權限使用\`${command.name}\`指令`);
      }
      command.execute(msg, arg, client);
    }
  },
};
