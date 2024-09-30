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
      return msg.reply(`抖內參數錯誤! 請tag抖內目標！ 不然我要沒收咯:p`);
    }

    if (target == msg.author.id) {
      const resultEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({
          name: msg.author.username,
          iconURL: msg.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields({
          name: `抖內警報`,
          value: `傻逼 \`${msg.author.username}\`想要抖內自己 那你真的是想太多了`,
        })
        .setTimestamp();

      return msg.reply({ embeds: [resultEmbed] });
    }

    const numberUtil = require('../utility/number');
    const currentLeverage = await leverage.get(msg.author);
    args[1] = numberUtil.numberParse(args[1], currentLeverage);

    if (isNaN(args[1])) {
      return msg.reply(
        `抖內參數錯誤! 請輸入數字! 指令範例:\`!g @AustinBabe 100\``
      );
    }

    if (parseInt(args[1]) <= 0) {
      return msg.reply(
        `抖內參數錯誤! 數字必須為大於0的數字 指令範例:\`!g @AustinBabe 100\``
      );
    }

    const amount = parseInt(args[1]);
    const isEnough = currentLeverage >= amount ? true : false;
    if (!isEnough) {
      return msg.reply(`你也有足夠沒錢錢啊 裝什麼大爺`);
    }
    leverage.add(msg.author, amount * -1);
    leverage.add(target, amount);

    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: msg.author.username,
        iconURL: msg.author.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: `抖內警報`,
        value:
          `爸爸 \`${msg.author.username}\` 抖內了 \`${amount}\` ${emoji} \n` +
          `給你  <@${target.id}>`,
      })
      .setTimestamp();

    return msg.reply({ embeds: [resultEmbed] });
  },
};
