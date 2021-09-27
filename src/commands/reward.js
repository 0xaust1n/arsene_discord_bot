module.exports = {
  name: 'reward',
  description: 'this is a reward command!',
  aliases: ['rw'],
  async execute(msg, args, client) {
    if (!args.length) {
      return msg.channel.send(`Reward指令參數錯誤! 參數不能為空白`);
    }
    const argsMap = initMap(new Map());
    const arg = args.shift().toLocaleLowerCase();
    if (argsMap.has(arg)) {
      const cd = require('../utility/cd');
      const leverage = require('../utility/leverage');
      const emoji = client.emojis.cache.get('889219097752129667');
      const obj = argsMap.get(arg);
      const user = msg.author;
      const currentLeverage = await leverage.get(user);
      cd.check(msg, obj.name).then((result) => {
        if (result == 'READY') {
          const prize = obj.prize;
          leverage.add(user, prize);
          cd.set(msg, obj.name, obj.type, obj.cd);
          return msg.channel.send(`恭喜\`${user.username}\`獲得 ${prize} ${emoji}`);
        } else {
          return msg.channel.send(`指令冷卻中 剩餘時間:**${result}**`);
        }
      });
    } else {
      return msg.channel.send(`Reward指令參數錯誤! 接受參數為: \`hourly\` , \`daily\` , \`weekly\``);
    }
  },
};

const initMap = (map) => {
  map.set('h', { name: 'hourly', prize: 600, type: 'h', cd: '1' });
  map.set('hourly', { name: 'hourly', prize: 600, type: 'h', cd: '1' });
  map.set('d', { name: 'daily', prize: 2400, type: 'd', cd: '1' });
  map.set('daily', { name: 'daily', prize: 2400, type: 'd', cd: '1' });
  map.set('w', { name: 'weekly', prize: 5000, type: 'd', cd: '7' });
  map.set('weekly', { name: 'weekly', prize: 5000, type: 'd', cd: '7' });
  return map;
};
