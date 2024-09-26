module.exports = {
  name: 'jackpot',
  description: 'this is a jackpot command!',
  aliases: ['jp', 'sp'],
  async execute(msg, args, client) {
    const cd = require('../utility/cd');
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;
    // init user amount
    await leverage.get(user);
    // const currentLeverage = await leverage.get(user);
    cd.check(msg, this.name).then((result) => {
      if (result == 'READY') {
        const min = 2000;
        const max = 10000;

        const random = require('../utility/random');
        const prize = random.getRandomInt(min, max);
        // prettier-ignore
        const bonusArray = [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          6, 6, 6, 6, 6, 6, 6, 6, 6,
          7, 7, 7, 7, 7, 7, 7, 7,
          8, 8, 8, 8, 8, 8, 8,
          9, 9, 9, 9, 9, 9,
          10,10,10,10,10,
        ];

        const bonus = random.gertRandomElemet(bonusArray);

        if (prize == max) {
          leverage.add(user, prize * 1000);
          msg.reply(
            `大吉！${1000}倍獎勵！恭喜你獲得大獎 ${
              prize * 1000
            }  ${emoji} ${emoji} ${emoji} ${emoji} ${emoji}`
          );
        }

        if (prize == min) {
          leverage.add(user, prize * 100);
          msg.reply(
            `末吉！${1000}倍獎勵！恭喜你獲得安慰獎 ${
              prize * 1000
            } 雖小只是一時 由我幫你改運  ${emoji} ${emoji} ${emoji}`
          );
        }

        if (bonus > 1) {
          leverage.add(user, prize * bonus);
          if (bonus == 10) {
            msg.reply(
              `吉！${bonus}倍獎勵！恭喜你獲得 ${prize * bonus} ${emoji}`
            );
          }
          if (bonus >= 5 && bonus < 10) {
            msg.reply(
              `中吉！${bonus}倍獎勵！恭喜你獲得 ${prize * bonus} ${emoji}`
            );
          }
          if (bonus < 5) {
            msg.reply(
              `小吉！${bonus}倍獎勵！恭喜你獲得 ${prize * bonus} ${emoji}`
            );
          }
        } else {
          leverage.add(user, prize);
          msg.reply(`半吉！恭喜你獲得 ${prize} ${emoji}`);
        }

        cd.set(msg, this.name, 'm', 2);
      } else {
        msg.reply(`指令冷卻中 剩餘時間:**${result}**`);
      }
    });
  },
};
