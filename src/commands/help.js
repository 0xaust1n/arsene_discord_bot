const { MessageEmbed } = require('discord.js');
const { prefix } = require('../configs/configs.json');

module.exports = {
  name: 'help',
  description: 'this is a help command!',
  execute(msg, args, client) {
    const emoji = client.emojis.cache.get('738680578974548038');
    const adminCommands = () => {
      return `
      \`clear\`
      `;
    };

    const generalCommand = () => {
      return `
      \`help\` , \`coinflip\` , \`ping\`
      `;
    };
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`目前指令前綴為: \`${prefix}\``)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addField('一般指令:', generalCommand())
      .addField('管理員指令:', adminCommands())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
