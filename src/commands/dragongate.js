const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dragonGate',
  description: 'this is a dragonGate command!',
  aliases: ['dg'],
  user: '',
  async execute(msg, args, client) {
    // import
    const leverageUtil = require('../utility/leverage');
    const configUtil = require('../utility/config');
    const gameHistoryUtli = require('../utility/game-history');

    // const
    const coinEmoji = client.emojis.cache.get('889219097752129667');
    this.user = msg.author;
    const configs = await configUtil.getConfig(this.name);

    // get pool
    let gameHistory = await gameHistoryUtli.getHistory(this.name);
    let extraPool = 0;
    if (gameHistory) {
      extraPool = gameHistory.pool;
    }
    // 底池
    const random = require('../utility/random');
    const pool =
      extraPool == 0
        ? random.getRandomInt(configs.min, configs.max)
        : extraPool;
    // save pool when is not exist
    if (extraPool == 0) {
      await gameHistoryUtli.addToPool(this.name, pool);
    }
    // 撞柱賠率
    const rate = configs.rate;

    // check pool command
    const acceptArgs = ['pool', 'p'];
    if (args[0]) {
      if (acceptArgs.includes(args[0].toLocaleLowerCase())) {
        const poolMessage =
          `目前底池為 ${pool.toLocaleString()} ${coinEmoji}\n` +
          `撞柱賠率為 ${rate} 倍\n` +
          `預設底池範圍為 ${configs.min.toLocaleString()} ~ ${configs.max.toLocaleString()} ${coinEmoji}`;
        const embedMessage = this.message(poolMessage);
        msg.reply({ embeds: [embedMessage] });
        return;
      }
    }

    // get user leverage
    const userLeverage = await leverageUtil.get(this.user);
    // check if user has enough leverage
    if (userLeverage < pool * rate) {
      let resultString =
        `籌碼數量錯誤! 沒有足夠的籌碼!\n` +
        `撞柱賠率為 ${rate} 倍\n` +
        `底池為${pool.toLocaleString()} ${coinEmoji}\n` +
        `籌碼需至少擁有 ${(pool * rate).toLocaleString()} ${coinEmoji} \n` +
        `目前籌碼數量為 ${userLeverage.toLocaleString()} ${coinEmoji}\n` +
        `請重新輸入`;

      const embedMessage = this.message(resultString);
      msg.reply({ embeds: [embedMessage] });
      return;
    }

    const pokerUtil = require('../utility/pocker');
    let deck = pokerUtil.genDeck();
    if (Object.hasOwn(gameHistory, 'deck')) {
      if (gameHistory.deck.length >= 3) {
        deck = gameHistory.deck;
      }
    }

    // deal card
    const hand = pokerUtil.dealAndSortHand(deck, 2);
    // display hand
    const handStr = hand.reduce((acc, card, index) => {
      return (
        acc +
        `\`${card.replace('/', '')}\`` +
        (index != hand.length - 1 ? '    ' : '')
      );
    }, '');

    // check hand is equal
    const isHandEqual = pokerUtil.isHandEqual(hand);

    if (isHandEqual) {
      const total = await leverageUtil.add(this.user, pool);

      const handEqualResultString =
        `你的手牌: ${handStr}\n` +
        `恭喜可以直接帶走底池 ${pool.toLocaleString()} ${coinEmoji}\n` +
        `你現在籌碼數量為: ${total.toLocaleString()} ${coinEmoji}`;

      const embedMessage = this.message(handEqualResultString);
      msg.reply({ embeds: [embedMessage] });

      // update game history
      gameHistoryUtli.saveHistory(this.name, {
        pool: 0,
        deck: deck,
      });
      return;
    }

    // ------------------------------------

    const resultString =
      `你的手牌: ${handStr}\n` +
      `底池: ${pool.toLocaleString()} ${coinEmoji}\n` +
      `撞柱賠率: ${rate} 倍\n` +
      `請在1分鐘內輸入 \`YES\` 或 \`NO\` 來選擇是否下注 \n` +
      `回答\`NO\`會扣除: ${Math.floor(
        pool * 0.3
      ).toLocaleString()}${coinEmoji}\n` +
      `不回答會扣除: ${Math.floor(pool * 0.5).toLocaleString()}${coinEmoji}`;
    const embedMessage = this.message(resultString);
    await msg.reply({ embeds: [embedMessage] });

    // listener for message
    const filter = (m) => {
      return m.author == msg.author;
    };

    const collector = msg.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    // ------------------------------------

    let isReply = false;

    // collector func
    collector.on('collect', async (m) => {
      const reply = m.content;
      if (
        reply.toLocaleLowerCase() == 'yes' ||
        reply.toLocaleLowerCase() == 'y'
      ) {
        isReply = true;
        const deal = pokerUtil.deal(deck, 1)[0];
        const result = pokerUtil.dragonGateGame(hand, deal);

        let earn = 0;
        let displayEarn = '';
        let isWin = false;

        if (result == 'win') {
          isWin = true;
          earn = Math.floor(pool);
          displayEarn = `你贏了 ${earn.toLocaleString()} ${coinEmoji}`;
        } else if (result == 'hit') {
          isWin = false;
          earn = -Math.floor(pool * rate);
          displayEarn = `你撞柱了! 你輸了 ${Math.floor(
            pool * rate
          ).toLocaleString()} ${coinEmoji}`;
        } else {
          isWin = false;
          earn = -Math.floor(pool);
          displayEarn = `你輸了 ${Math.abs(
            earn
          ).toLocaleString()} ${coinEmoji}`;
        }

        const total = await leverageUtil.add(this.user, earn);

        const resultString =
          `你的底牌：\`${deal.replace('/', '')}\` \n` +
          `你的區間: ${handStr}\n` +
          `底池: ${pool.toLocaleString()} ${coinEmoji}\n` +
          `撞柱賠率: ${rate} 倍\n` +
          `${displayEarn}\n` +
          `你現在籌碼數量為: ${total.toLocaleString()} ${coinEmoji}`;

        const resultEmbed = this.message(resultString);
        m.reply({ embeds: [resultEmbed] });

        const xp = require('../utility/xp');
        xp.add(msg, pool);

        // if pool bigger than 0, save to game history

        if (earn < 0) {
          gameHistoryUtli.saveHistory(this.name, {
            pool: Math.abs(earn) + (extraPool > 0 ? 0 : extraPool),
            deck: deck,
            isWin: isWin,
          });
        } else {
          gameHistoryUtli.saveHistory(this.name, {
            pool: 0,
            deck: deck,
            isWin: isWin,
          });
        }

        collector.stop();
      } else if (
        reply.toLocaleLowerCase() == 'no' ||
        reply.toLocaleLowerCase() == 'n'
      ) {
        isReply = true;
        // remove 30% of pool
        const earn = -Math.floor(pool * 0.3);
        const total = await leverageUtil.add(this.user, earn);
        const resultString =
          `你放棄了這手牌\n` +
          `你被扣除了 ${Math.abs(earn).toLocaleString()} ${coinEmoji}\n` +
          `你現在籌碼數量為: ${total.toLocaleString()} ${coinEmoji}`;
        const resultEmbed = this.message(resultString);
        m.reply({ embeds: [resultEmbed] });

        // update game history
        gameHistoryUtli.saveHistory(this.name, {
          pool: Math.abs(earn),
          deck: deck,
          isWin: false,
        });
        collector.stop();
      }
    });

    collector.on('end', async (collected) => {
      if (!isReply) {
        // give half of leverage back to user
        await leverageUtil.add(msg.author, (pool * 0.5).toLocaleString());
        return msg.reply('回覆超時!下注失敗 懲罰將扣除你的一半賭注');
      }
    });
  },

  message(msg) {
    const embedMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: this.user.username,
        iconURL: this.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields({ name: '射龍門', value: msg })
      .setTimestamp();
    return embedMessage;
  },
};
