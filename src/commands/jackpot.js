module.exports = {
  name: 'jackpot',
  description: 'this is a jackpot command!',
  aliases: ['jp', 'sp'],
  async execute(msg, args, client) {
    const cd = require('../utility/cd');
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;
    const currentLeverage = await leverage.get(user);
    cd.check(msg, this.name).then((result) => {
      if (result == 'READY') {
        const max = 500;
        const prize = getRandomInt(max);

        if (prize != max) {
          leverage.add(user, prize);
          msg.channel.send(`恭喜你獲得 ${prize} ${emoji}`);
        } else {
          leverage.add(user, prize * 1000);
          msg.channel.send(`恭喜你獲得大獎 ${prize * 1000}  ${emoji} ${emoji} ${emoji} ${emoji} ${emoji}`);
        }

        cd.set(msg, this.name, 'm', 2);
      } else {
        msg.channel.send(`指令冷卻中 剩餘時間:**${result}**`);
      }
    });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1));
};
