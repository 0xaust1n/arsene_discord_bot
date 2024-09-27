const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dragonGate',
  description: 'this is a dragonGate command!',
  aliases: ['dg'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;
    const configUtil = require('../utility/config');
    const configs = await configUtil.getConfig(this.name);

    const gameHistoryUtli = require('../utility/game-history');
    const gameHistory = await gameHistoryUtli.getHistory(this.name);

    let extraPool = 0;

    if (gameHistory) {
      extraPool = gameHistory.pool;
    }

    // 底池
    const pool = extraPool == 0 ? configs.pool : extraPool;
    // 撞柱賠率
    const rate = configs.rate;

    const userLeverage = await leverage.get(user);

    if (userLeverage < pool * rate) {
      let resultString =
        `籌碼數量錯誤! 沒有足夠的籌碼!\n` +
        `撞柱賠率為 ${rate} 倍\n` +
        `底池為${pool.toLocaleString()} ${emoji}\n` +
        `籌碼需至少擁有 ${(pool * rate).toLocaleString()} ${emoji} \n` +
        `目前籌碼數量為 ${userLeverage.toLocaleString()} ${emoji}\n` +
        `請重新輸入`;

      const embedMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .addFields({ name: '射龍門', value: resultString })
        .setTimestamp();

      msg.reply({ embeds: [embedMessage] });

      return;
    }

    const pokerUtil = require('../utility/pocker');

    let deck = [];
    if (gameHistory) {
      if (deck.length >= 3) {
        deck = gameHistory.deck;
      } else {
        deck = pokerUtil.genDeck();
      }
    } else {
      deck = pokerUtil.genDeck();
    }
    const hand = pokerUtil.dealAndSortHand(deck, 2);

    const handStr = hand.reduce((acc, card, index) => {
      return (
        acc +
        `\`${card.replace('/', '')}\`` +
        (index != hand.length - 1 ? '    ' : '')
      );
    }, '');

    const isHandEqual = pokerUtil.isHandEqual(hand);

    if (isHandEqual) {
      const total = await leverage.add(user, pool);

      const handEqualResultString =
        `你的手牌: ${handStr}\n` +
        `恭喜可以直接帶走底池 ${pool.toLocaleString()} ${emoji}\n` +
        `你現在籌碼數量為: ${total.toLocaleString()} ${emoji}`;

      const embedMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .addFields({ name: '射龍門', value: handEqualResultString })
        .setTimestamp();

      msg.reply({ embeds: [embedMessage] });

      // update game history
      gameHistoryUtli.saveHistory(this.name, {
        pool: 0,
        deck: deck,
      });

      return;
    }

    const resultString = () => {
      return (
        `你的手牌: ${handStr}\n` +
        `底池: ${pool.toLocaleString()} ${emoji}\n` +
        `撞柱賠率: ${rate} 倍\n` +
        `請在1分鐘內輸入 \`YES\` 或 \`NO\` 來選擇是否下注 \n` +
        `回答\`NO\`會扣除: ${Math.floor(
          pool * 0.3
        ).toLocaleString()}${emoji}\n` +
        `不回答會扣除: ${Math.floor(pool * 0.5).toLocaleString()}${emoji}`
      );
    };

    const embedMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .addFields({ name: '射龍門', value: resultString() })
      .setTimestamp();

    msg.reply({ embeds: [embedMessage] });

    // listener for message
    const filter = (m) => {
      return m.author == msg.author;
    };

    const collector = msg.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    let isReply = false;

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
          displayEarn = `你贏了 ${earn.toLocaleString()} ${emoji}`;
        } else if (result == 'hit') {
          isWin = false;
          earn = -Math.floor(pool * rate);
          displayEarn = `你撞柱了! 你輸了 ${Math.floor(
            pool * rate
          ).toLocaleString()} ${emoji}`;
        } else {
          isWin = false;
          earn = -Math.floor(pool);
          displayEarn = `你輸了 ${Math.abs(earn).toLocaleString()} ${emoji}`;
        }

        const total = await leverage.add(user, earn);

        const resultString = () => {
          return (
            `你的底牌：\`${deal.replace('/', '')}\` \n` +
            `你的區間: ${handStr}\n` +
            `底池: ${pool.toLocaleString()} ${emoji}\n` +
            `撞柱賠率: ${rate} 倍\n` +
            `${displayEarn}\n` +
            `你現在籌碼數量為: ${total.toLocaleString()} ${emoji}`
          );
        };

        const resultEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .addFields({ name: '射龍門', value: resultString() })
          .setTimestamp();

        m.reply({ embeds: [resultEmbed] });
        const xp = require('../utility/xp');
        xp.add(msg, pool);

        // update game history
        gameHistoryUtli.saveHistory(this.name, {
          pool: pool - earn,
          deck: deck,
        });

        collector.stop();
      } else if (
        reply.toLocaleLowerCase() == 'no' ||
        reply.toLocaleLowerCase() == 'n'
      ) {
        isReply = true;
        // remove 30% of pool
        const earn = -Math.floor(pool * 0.3);
        const total = await leverage.add(user, earn);
        const resultString = () => {
          return (
            `你放棄了這手牌\n` +
            `你被扣除了 ${Math.abs(earn).toLocaleString()} ${emoji}\n` +
            `你現在籌碼數量為: ${total.toLocaleString()} ${emoji}`
          );
        };

        const resultEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .addFields({ name: '射龍門', value: resultString() })
          .setTimestamp();

        m.reply({ embeds: [resultEmbed] });

        // update game history
        gameHistoryUtli.saveHistory(this.name, {
          pool: pool - earn,
          deck: deck,
        });

        collector.stop();
      }
    });

    collector.on('end', async (collected) => {
      if (!isReply) {
        // give half of leverage back to user
        await leverage.add(msg.author, (pool * 0.5).toLocaleString());
        return msg.reply('回覆超時!下注失敗 懲罰將扣除你的一半賭注');
      }

      const random = require('../utility/random');
      // add random leverage to pool
      await gameHistoryUtli.savePool(this.name, {
        pool: +random.getRandomInt(5000, 50000),
      });
    });
  },
};
