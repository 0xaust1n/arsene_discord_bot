module.exports = {
  name: 'claimall',
  description: 'this is a claimall command!',
  aliases: ['ca'],
  async execute(msg, args, client) {
    const rewardArray = [
      { name: 'hourly', prize: 600, type: 'h', cd: '1' },
      { name: 'daily', prize: 2400, type: 'd', cd: '1' },
      { name: 'weekly', prize: 5000, type: 'd', cd: '7' },
    ];
    const cd = require('../utility/cd');
    let sum = 0;
    for (let i = 0; i < rewardArray.length; i++) {
      const obj = rewardArray[i];
      const result = await cd.get(msg, obj.name);
      if (result == 'READY') {
        sum += obj.prize;
        cd.set(msg, obj.name, obj.type, obj.cd);
      }
    }
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    if (sum > 0) {
      leverage.add(msg, sum);
      return msg.channel.send(`恭喜你獲得 ${sum} ${emoji}`);
    } else {
      msg.channel.send(`指令全部都在冷卻中`);
    }
  },
};
