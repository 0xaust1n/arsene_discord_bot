const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'give',
  description: 'this is a give command!',
  aliases: ['give', 'g'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    let target;
    if (msg.mentions.users.first() != undefined) {
      target = msg.mentions.users.first();
    } else {
      return msg.reply(`斗內參數錯誤! 請tag斗內目標！ 不然我要沒收咯:p`);
    }

    if (isNaN(args[1])) {
      return msg.reply(`斗內參數錯誤! 請輸入數字! 指令範例:\`!g @AustinBabe 100\``);
    }
    const amount = parseInt(args[1]);
    const currentLeverage = await leverage.get(msg.author);
    const isEnough = currentLeverage >= amount ? true : false;
    if (!isEnough) {
      return msg.reply(`你也有足夠沒錢錢啊 裝什麼大爺`);
    }
    leverage.add(msg.author, amount * -1);
    leverage.add(target, amount);

    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
      .addFields({
        name: `斗內警報`,
        value: `爸爸 \`${msg.author.username}\` 斗內了 \`${amount}\` ${emoji} \n` + `給你  <@${target.id}>`,
      })
      .setTimestamp();

    return msg.reply({ embeds: [resultEmbed] });
  },
};
