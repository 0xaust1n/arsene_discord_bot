const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'chips',
  description: 'this is a chips command!',
  aliases: ['cp'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const total = await leverage.get(msg);
    const resultString = () => {
      return `
      **${total}** ${emoji}
      `;
    };
    let user;
    if (msg.mentions.users.first() != undefined) {
      user = msg.mentions.users.first();
    } else {
      user = msg.author;
    }

    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('籌碼數量', resultString())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
