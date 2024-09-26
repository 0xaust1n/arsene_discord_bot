const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pk',
  description: 'this is a reward command!',
  aliases: ['pk'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');

    if (!args.length) {
      return msg.reply(`PK指令錯誤! \n` + `範例: \`pk 50\`\n` + `請重新輸入`);
    }
    const currentLeverage = await leverage.get(msg.author);
    const acceptAmountArgs = ['a', 'all'];
    const input = isNaN(args[0]) ? args[0].toLocaleLowerCase() : args[0];

    if (isNaN(input) && !acceptAmountArgs.includes(input)) {
      msg.reply(`籌碼數量參數錯誤! 請輸入數字或是 **all** \n` + `範例: \`pk 50\`\n` + `請重新輸入`);
      return;
    }

    if (parseInt(input) <= 0) {
      msg.reply(`籌碼數量參數錯誤! 數量請大於0 \n` + `範例: \`pk 50\`\n` + `請重新輸入`);
      return;
    }

    if (currentLeverage == 0) {
      msg.reply(`籌碼數量錯誤! 籌碼為 0 \n` + `賭癮就先緩緩吧少年~`);
      return;
    }

    let inputLeverage = 0;
    if (acceptAmountArgs.includes(input)) {
      inputLeverage = currentLeverage;
    } else {
      inputLeverage = Math.floor(input);
    }

    const isEnough = currentLeverage >= inputLeverage ? true : false;
    if (!isEnough) {
      msg.reply(
        `籌碼數量錯誤! 沒有足夠的籌碼 \n` +
          `目前籌碼數量為 ${currentLeverage} ${emoji}\n` +
          `範例: \`pk ${currentLeverage}\`` +
          `請重新輸入`
      );
      return;
    }

    // remove input leverage from user
    await leverage.add(msg.author, inputLeverage * -1);

    const random = require('../utility/random');
    const clientNumber = random.getRandomInt(1, 1000);
    let smallRate = (1 / ((1000 - clientNumber) / 1000)).toFixed(2);
    let bigRate = (1 / (clientNumber / 1000)).toFixed(2);
    if (clientNumber == 1000) {
      bigRate = 100;
      smallRate = 1000;
    }
    if (clientNumber == 1) {
      bigRate = 1000;
      smallRate = 100;
    }

    const responseString =
      `你的數字為: ${clientNumber} \n` +
      `請問要比大還是比小還是平手\n` +
      `請在20秒內直接回覆以下內容（不分大小寫）:\n` +
      `比大: \`Big\` or \`B\` | 賠率 \`${bigRate}\` \n` +
      `比小: \`Small\` or \`S\` | 賠率 \`${smallRate}\` \n` +
      `平手: \`Tie\` or \`T\` | 賠率 \`1000\` `;
    const responseEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
      .addFields({ name: 'PK', value: responseString })
      .setTimestamp();

    msg.reply({ embeds: [responseEmbed] });

    const filter = (m) => {
      return m.author == msg.author;
    };

    const collector = msg.channel.createMessageCollector({ filter, time: 20000 });
    let isReply = false;
    let isWin = false;
    let bettingRate = 1;
    let bet = '';
    let total = 0;
    const botNumber = random.getRandomInt(1, 1000);

    collector.on('collect', async (m) => {
      const reply = m.content;
      if (reply.toLocaleLowerCase() == 'big' || reply.toLocaleLowerCase() == 'b') {
        isReply = true;
        isWin = botNumber < clientNumber ? true : false;
        bettingRate = isWin ? bigRate : 1;
        bet = '大';
      } else if (reply.toLocaleLowerCase() == 'small' || reply.toLocaleLowerCase() == 's') {
        isReply = true;
        isWin = botNumber > clientNumber ? true : false;
        bettingRate = isWin ? smallRate : 1;
        bet = '小';
      } else if (reply.toLocaleLowerCase() == 'tie' || reply.toLocaleLowerCase() == 't') {
        isReply = true;
        isWin = botNumber == clientNumber ? true : false;
        bettingRate = isWin ? 1000 : 1;
        bet = '平手';
      }

      if (isReply) {
        if (isWin) {
          let reward = Math.floor(inputLeverage * bettingRate);
          // await leverage.add(msg.author, inputLeverage);
          total = await leverage.add(msg.author, reward);
        } else {
          total = await leverage.add(msg.author, 0);
        }
        const resultString =
          `你的數字為: ${clientNumber}\n` +
          `我的數字為: ${botNumber}\n` +
          `你的下注為: ${bet}\n` +
          `${isWin ? '你贏了' : '你輸了'} ${Math.floor(inputLeverage * bettingRate).toLocaleString()} ${emoji} \n` +
          `你現在籌碼數量為: ${total.toLocaleString()} ${emoji} \n`;

        const resultEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
          .addFields({ name: 'PK', value: resultString })

          .setTimestamp();

        m.reply({ embeds: [resultEmbed] });
        const xp = require('../utility/xp');
        xp.add(msg, inputLeverage);
        collector.stop();
      }
    });

    collector.on('end', async (collected) => {
      if (!isReply) {
        // give half of leverage back to user
        await leverage.add(msg.author, inputLeverage * 0.5);
        return msg.reply('回覆超時!下注失敗 懲罰將扣除你的一半賭注');
      }
    });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max + 1);
};
