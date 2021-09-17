const { Permissions } = require('discord.js');
const { prefix } = require('../../configs/configs.json');

module.exports = {
  name: 'messageCreate',
  once: false,
  execute(msg, client) {
    //spam dealing
    if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (msg.content.toLocaleLowerCase().includes('nitro')) {
        msg.channel.send(`大家 \`${msg.author.username}\` 被盜了, 請大家小心`);
        msg.member.ban({ day: 1, reason: '帳號被盜' }).then(console.log(`${msg.author.username} 被封鎖`));
        return msg.delete();
      }
    }
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
