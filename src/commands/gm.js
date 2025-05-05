const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'gm',
  description: 'this is a gm command!',
  prems: ['Administrator'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    if (args[0] == 'on') {
      await leverage.set(msg.author, 999999999999);
      msg.reply({
        content: `GM模式已開啟`,
        ephemeral: true,
      });
      return;
    }

    if (args[0] == 'off') {
      await leverage.set(msg.author, 0);
      msg.reply({
        content: `GM模式已關閉`,
        ephemeral: true,
      });
      return;
    }

    if (args[0] == 'give' || args[0] == 'g') {
      const target = msg.mentions.users.first();
      const numberUtil = require('../utility/number');
      args[2] = numberUtil.numberParse(args[2], 0);
      const amount = parseInt(args[2]);
      leverage.add(target, amount);

      const resultEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({
          name: msg.author.username,
          iconURL: msg.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields({
          name: `GM空投`,
          value: `GM抖內了 \`${amount}\` ${emoji} \n` + `給你  <@${target.id}>`,
        })
        .setTimestamp();

      return msg.reply({ embeds: [resultEmbed] });
    }
  },
};
