const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'chips',
  description: 'this is a chips command!',
  aliases: ['cp'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    let user;
    if (msg.mentions.users.first() != undefined) {
      user = msg.mentions.users.first();
    } else {
      user = msg.author;
    }

    const total = await leverage.get(user);
    const resultString = () => {
      return `
      **${total.toLocaleString()}** ${emoji}
      `;
    };

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields({ name: '籌碼數量', value: resultString() })
      .setTimestamp();

    msg.reply({ embeds: [resultEmbed] });
  },
};
