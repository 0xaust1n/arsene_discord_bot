const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'level',
  description: 'this is a level command!',
  aliases: ['lv', 'rank', 'rk'],
  async execute(msg, args, client) {
    const level = require('../utility/level');
    const xp = require('../utility/xp');
    const leverage = require('../utility/leverage');
    const currentLeverage = await leverage.get(msg);
    const currentLevel = await level.get(msg);
    const currentXp = await xp.get(msg);
    const nextXp = level.getNextLevelXp(currentXp);
    let sectionOne = `\`等級\`: ${currentLevel}\n`;
    sectionOne += `\`經驗值\`: ${currentXp}\n`;
    sectionOne += `\`距離升級\`: ${parseInt(nextXp) - parseInt(currentXp)}\n`;
    let resultEmbed;
    if (msg.mentions.users.first() != undefined) {
      const metions = msg.mentions.users.first();
      resultEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(metions.username, metions.displayAvatarURL({ dynamic: true }))
        .setThumbnail(metions.displayAvatarURL({ dynamic: true }))
        .addField('Level', sectionOne)
        .setTimestamp();
    } else {
      resultEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
        .addField('Level', sectionOne)
        .setTimestamp();
    }

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
