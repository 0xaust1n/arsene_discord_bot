const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'gm',
  description: 'this is a gm command!',
  prems: ['Administrator'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const accpetArgs = ['on', 'off', 'give', 'g'];

    if (args[0] && !accpetArgs.includes(args[0])) {
      msg.reply({
        content: `請輸入正確的指令`,
        ephemeral: true,
      });
      return;
    }

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
          name: 'GM',
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .addFields({
          name: `GM抖內警報`,
          value:
            `GM抖內給 <@${target.id}> \n` +
            `金額: ${amount} ${emoji} \n` +
            `餘額: ${await leverage.get(target)} ${emoji}`,
        })
        .setTimestamp();

      return msg.reply({ embeds: [resultEmbed] });
    }
  },
};
