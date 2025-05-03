const random = require('../utility/random');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'russianRoulette',
  description: 'russianRoulette',
  aliases: ['rr'],

  // Helper method to create embedded messages
  createEmbed(title, description, color = '#0099ff') {
    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();
  },

  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;

    // Input validation
    if (!args.length) {
      const errorEmbed = this.createEmbed(
        '❌ 參數錯誤',
        `籌碼數量參數錯誤! 未輸入數量\n範例: \`rr 50\`\n請重新輸入`,
        '#ff0000'
      );
      return msg.reply({ embeds: [errorEmbed] });
    }

    const userLeverage = await leverage.get(user);

    const numberUtil = require('../utility/number');
    const inputAmount = parseInt(numberUtil.numberParse(args[0], userLeverage));

    if (isNaN(inputAmount)) {
      const errorEmbed = this.createEmbed(
        '❌ 參數錯誤',
        `籌碼數量參數錯誤! 輸入的數量不是數字\n範例: \`rr 50\`\n請重新輸入`,
        '#ff0000'
      );
      return msg.reply({ embeds: [errorEmbed] });
    }

    if (userLeverage == 0) {
      const brokeEmbed = this.createEmbed(
        '💸 破產了',
        `籌碼為 0\n子彈你買不起啦幹`,
        '#ff0000'
      );
      return msg.reply({ embeds: [brokeEmbed] });
    }

    // Game setup
    const slot = new Array(6).fill(0);
    slot[random.getRandomInt(0, 5)] = 1;

    let currentWin = inputAmount;
    let remainingSlots = [...slot];

    // First shot
    const firstBullet = remainingSlots.pop();
    if (firstBullet == 1) {
      await leverage.add(user, -inputAmount);
      const loseEmbed = this.createEmbed(
        '💀 Game Over',
        `你第一發子彈就被打中了! 超級可悲\n你輸了 ${inputAmount.toLocaleString()} ${emoji}`,
        '#ff0000'
      );
      return msg.reply({ embeds: [loseEmbed] });
    }

    // Setup message collector
    const filter = (m) => m.author.id === user.id;
    const collector = msg.channel.createMessageCollector({
      filter,
      time: 60000,
      idle: 60000,
    });

    // Send first prompt
    const continueEmbed = this.createEmbed(
      '🎯 俄羅斯輪盤',
      `你沒有被子彈打中!\n是否要繼續?\n請在1分鐘內輸入 \`YES\` 或 \`NO\` 選擇是否繼續`,
      '#0099ff'
    ).addFields(
      {
        name: '當前獎金',
        value: `${currentWin.toLocaleString()} ${emoji}`,
        inline: true,
      },
      { name: '剩餘機會', value: `${remainingSlots.length}`, inline: true }
    );

    msg.reply({ embeds: [continueEmbed] });

    // Handle all responses in one collector
    collector.on('collect', async (response) => {
      const reply = response.content.toLowerCase();

      if (reply === 'yes' || reply === 'y') {
        const bullet = remainingSlots.pop();

        if (bullet === 1) {
          await leverage.add(user, -inputAmount);
          const loseEmbed = this.createEmbed(
            '💀 Game Over',
            `你被子彈打中了! 超級可悲\n你輸了 ${inputAmount.toLocaleString()} ${emoji}`,
            '#ff0000'
          );
          msg.reply({ embeds: [loseEmbed] });
          return collector.stop();
        }

        currentWin += inputAmount;
        const continueEmbed = this.createEmbed(
          '🎯 俄羅斯輪盤',
          `你沒有被子彈打中!\n是否要繼續?\n請在1分鐘內輸入 \`YES\` 或 \`NO\` 選擇是否繼續`,
          '#0099ff'
        ).addFields(
          {
            name: '當前獎金',
            value: `${currentWin.toLocaleString()} ${emoji}`,
            inline: true,
          },
          { name: '剩餘機會', value: `${remainingSlots.length}`, inline: true }
        );

        msg.reply({ embeds: [continueEmbed] });
      } else if (reply === 'no' || reply === 'n') {
        let winEmbed = null;
        if (remainingSlots.length == 1) {
          await leverage.add(user, currentWin * 10);
          winEmbed = this.createEmbed(
            '🎉 恭喜獲勝! 你是勇者',
            `你贏了\`10\`倍的 ${currentWin.toLocaleString()} ${emoji}`,
            '#0099ff'
          );
        } else {
          await leverage.add(user, currentWin);
          winEmbed = this.createEmbed(
            '🎉 恭喜獲勝',
            `你贏了 ${currentWin.toLocaleString()} ${emoji}`,
            '#0099ff'
          );
        }
        msg.reply({ embeds: [winEmbed] });
        collector.stop();
      } else {
        const errorEmbed = this.createEmbed(
          '❌ 輸入錯誤',
          `請在1分鐘內輸入 \`YES\` 或 \`NO\` 選擇是否繼續`,
          '#ff0000'
        );
        msg.reply({ embeds: [errorEmbed] });
      }
    });

    // Handle collector end
    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        const timeoutEmbed = this.createEmbed(
          '⏰ 遊戲結束',
          '遊戲超時結束了!',
          '#ff9900'
        );
        msg.reply({ embeds: [timeoutEmbed] });
      }
    });
  },
};
