const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'atm',
  description: 'this is a atm command!',
  aliases: ['atm', 'bank', 'b'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const atm = require('../utility/atm');
    const emoji = client.emojis.cache.get('889219097752129667');
    // ---
    let user = msg.author;
    let firstArg = args[0];
    if (firstArg == undefined || firstArg == 'get' || firstArg == 'g') {
      firstArg = 'g';
      const amount = await atm.get(user);
      const cash = await leverage.get(user);
      const resultString = `現金: ${cash.toLocaleString()} ${emoji}\n` + `餘額: ${amount.toLocaleString()} ${emoji}`;
      const resultEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'BANK', value: resultString })
        .setTimestamp();
      return msg.reply({ embeds: [resultEmbed] });
    }

    let acceptArgs = ['s', 'save', 'w', 'withdraw', 'get', 'g'];
    if (!acceptArgs.includes(firstArg) && firstArg != undefined) {
      const resultString = `BANK參數錯誤！ 範例： \`atm get\``;

      const resultEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'BANK', value: resultString })
        .setTimestamp();
      return msg.reply({ embeds: [resultEmbed] });
    }

    firstArg = firstArg.substring(0, 1);
    if (args[1] == 'a' || args[1] == 'all') {
      if (firstArg == 'w') {
        args[1] = await atm.get(user);
      } else {
        args[1] = await leverage.get(user);
      }
    }

    if (isNaN(args[1]) && firstArg !== 'g') {
      const resultString = `
        BANK參數錯誤！ 第二個參數必須為數字！ 範例： \`atm save 50\`
      `;

      const resultEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'BANK', value: resultString })
        .setTimestamp();
      return msg.reply({ embeds: [resultEmbed] });
    }

    let inputAmount = parseInt(args[1]);

    if (inputAmount <= 0) {
      const resultString = `
        BANK參數錯誤！ 第二個參數必須為大於0！ 範例： \`atm save 1\`
      `;

      const resultEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'BANK', value: resultString })
        .setTimestamp();
      return msg.reply({ embeds: [resultEmbed] });
    }

    if (firstArg == 's') {
      const currentLeverage = await leverage.get(user);
      if (inputAmount > currentLeverage) {
        const resultString = `
          BANK參數錯誤！現金餘額不足！範例： \`atm save ${currentLeverage}\`
        `;

        const resultEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields({ name: 'BANK', value: resultString })
          .setTimestamp();
        return msg.reply({ embeds: [resultEmbed] });
      } else {
        const cash = await leverage.add(user, inputAmount * -1);
        const amount = await atm.save(user, inputAmount);
        const resultString =
          `存入: ${inputAmount.toLocaleString()} ${emoji} \n` +
          `餘額: ${amount.toLocaleString()} ${emoji} \n` +
          `現金: ${cash.toLocaleString()} ${emoji}\n`;

        const resultEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields({ name: 'BANK', value: resultString })
          .setTimestamp();
        return msg.reply({ embeds: [resultEmbed] });
      }
    }

    if (firstArg == 'w') {
      const atmAmount = await atm.get(user);
      console.log(atmAmount);
      if (inputAmount > atmAmount) {
        const resultString = `
          BANK參數錯誤！存款餘額不足！範例： \`atm get ${atmAmount}\`
        `;

        const resultEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields({ name: 'BANK', value: resultString })
          .setTimestamp();
        return msg.reply({ embeds: [resultEmbed] });
      } else {
        const amount = await atm.withdraw(user, inputAmount);
        const cash = await leverage.add(user, inputAmount);
        const resultString =
          `取出: ${inputAmount.toLocaleString()} ${emoji} \n` +
          `餘額: ${amount.toLocaleString()} ${emoji} \n` +
          `現金: ${cash.toLocaleString()} ${emoji}\n`;

        const resultEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields({ name: 'BANK', value: resultString })
          .setTimestamp();
        return msg.reply({ embeds: [resultEmbed] });
      }
    }
  },
};
