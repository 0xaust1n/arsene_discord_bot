const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cooldown',
  description: 'this is a cooldown command!',
  aliases: ['cd'],
  async execute(msg, args, client) {
    const cd = require('../utility/cd');
    const cdKeyAry = ['jackpot', 'hourly', 'daily', 'weekly'];
    const user = msg.author;
    const cdResultAry = [];
    for (const key of cdKeyAry) {
      const temp = await cd.get(msg, key);
      cdResultAry.push(temp);
    }
    let resultString = '';
    for (let i = 0; i < cdResultAry.length; i++) {
      resultString += `\`${cdKeyAry[i]}\` : ${cdResultAry[i]}\n`;
    }
    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
      .addFields({ name: '冷卻時間', value: resultString })
      .setTimestamp();
    msg.reply({ embeds: [resultEmbed] });
  },
};
