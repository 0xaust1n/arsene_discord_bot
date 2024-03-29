const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'level',
  description: 'this is a level command!',
  aliases: ['lv', 'rank', 'rk'],
  async execute(msg, args, client) {
    const level = require('../utility/level');
    const xp = require('../utility/xp');
    const leverage = require('../utility/leverage');
    let user;
    if (msg.mentions.users.first() != undefined) {
      user = msg.mentions.users.first();
    } else {
      user = msg.author;
    }
    // init user amount
    await leverage.get(user);
    const currentLevel = await level.get(user);
    const currentXp = await xp.get(user);
    const nextXp = level.getNextLevelXp(currentXp);
    let sectionOne = `\`等級\`: ${currentLevel}\n`;
    sectionOne += `\`經驗值\`: ${currentXp}\n`;
    if (parseInt(currentXp) < 10000000000000) {
      sectionOne += `\`距離升級\`: ${parseInt(nextXp) - parseInt(currentXp)}\n`;
    }
    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields({ name: 'Level', value: sectionOne })
      .setTimestamp();

    msg.reply({ embeds: [resultEmbed] });
  },
};
