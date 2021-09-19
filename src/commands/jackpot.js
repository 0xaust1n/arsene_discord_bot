module.exports = {
  name: 'jackpot',
  description: 'this is a spin command!',
  aliases: ['jp'],
  async execute(msg, args, client) {
    const cd = require('../utility/cool_down');
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    cd.get(msg, this.name).then((result) => {
      if (result == 'READY') {
        const prize = getRandomInt(50);
        leverage.add(msg, prize);
        msg.channel.send(`恭喜你獲得 ${prize} ${emoji}`);
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
