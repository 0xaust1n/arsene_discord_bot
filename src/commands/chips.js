const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'chips',
  description: 'this is a chips command!',
  aliases: ['cp'],
  async execute(msg, args, client) {
    const leverageUtil = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const total = await leverageUtil.get(msg);
    const resultString = () => {
      return `
      **${total}** ${emoji}
      `;
    };
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
      .addField('籌碼數量', resultString())
      .setTimestamp();
    msg.channel.send({ embeds: [resultEmbed] });
  },
};
