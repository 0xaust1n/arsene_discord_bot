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
        const min = 200;
        const max = 800;
        const prize = getRandomInt(min, max);
        const bonusArray = [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 1, 1, 5, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 2, 2, 3, 1, 1, 5, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 2, 2, 1, 1, 1, 1, 10, 1, 1, 1, 2, 2, 1, 1, 1, 1,
        ];
        const bonus = bonusArray[getRandomIndex(bonusArray.length)];

        if (prize != max) {
          if (bonus == 1) {
            leverage.add(user, prize);
            msg.reply(`小吉！恭喜你獲得 ${prize} ${emoji}`);
          } else {
            leverage.add(user, prize * bonus);
            msg.reply(`中吉！恭喜你獲得 \`${bonus}\` 倍的${prize} ${emoji}！ 一共是${prize * bonus} ${emoji}`);
          }
        } else {
          leverage.add(user, prize * 1000);
          msg.reply(`大吉！恭喜你獲得大獎 ${prize * 1000}  ${emoji} ${emoji} ${emoji} ${emoji} ${emoji}`);
        }
        cd.set(msg, this.name, 'm', 2);
      } else {
        msg.reply(`指令冷卻中 剩餘時間:**${result}**`);
      }
    });
  },
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
};
