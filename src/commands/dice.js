const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'dice',
  description: 'this is a dice command!',
  aliases: ['d'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;
    if (args.length < 1) {
      msg.channel.send(`擲骰子指令錯誤! \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }
    const acceptArgs = ['odd', 'o', 'even', 'e', '1', '2', '3', '4', '5', '6'];
    const input = args.shift().toLocaleLowerCase().substring(0, 1);
    if (!acceptArgs.includes(input)) {
      msg.channel.send(`擲骰子參數錯誤! \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }
    let inputLeverage = 0;
    const currentLeverage = await leverage.get(user);
    const acceptAmountArgs = ['a', 'all'];
    if (!args.length) {
      msg.channel.send(`籌碼數量參數錯誤! 未輸入數量 \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }
    if (isNaN(args[0]) && !acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      msg.channel.send(`籌碼數量參數錯誤! 請輸入數字或是 **all** \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }

    if (parseInt(args[0]) <= 0) {
      msg.channel.send(`籌碼數量參數錯誤! 數量請大於0 \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }

    if (currentLeverage == 0) {
      msg.channel.send(`籌碼數量錯誤! 籌碼為 0 \n` + `範例: \`dice odd 50\`\n` + `請重新輸入`);
      return;
    }

    if (acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      inputLeverage = currentLeverage;
    } else {
      inputLeverage = Math.floor(parseInt(args.shift()));
    }

    const isEnough = currentLeverage >= inputLeverage ? true : false;
    if (!isEnough) {
      msg.channel.send(
        `籌碼數量錯誤! 沒有足夠的籌碼 \n` +
          `目前籌碼數量為 ${currentLeverage} ${emoji}\n` +
          `範例: \`coinflip tails 50\`` +
          `請重新輸入`
      );
      return;
    }

    //random flip result
    const dice = getRandomInt(6);
    const isEven = dice % 2 == 0 ? true : false;
    let result = false;
    let gaining = 0;
    if (!isNaN(input)) {
      const number = parseInt(input);
      if (number == dice) {
        result = true;
        gaining = inputLeverage * 6;
      } else {
        gaining = -inputLeverage;
      }
    } else {
      if (input.indexOf('o') > -1 && isEven == true) {
        result = true;
        gaining = inputLeverage;
      } else if (input.indexOf('e') > -1 && isEven == false) {
        result = true;
        gaining = inputLeverage;
      } else {
        gaining = -inputLeverage;
      }
    }
    const diceImgMap = new Map();
    const total = await leverage.add(user, gaining);
    diceImgMap.set(1, 'https://i.imgur.com/8V8Qlrl.png');
    diceImgMap.set(2, 'https://i.imgur.com/0pj3Rjb.png');
    diceImgMap.set(3, 'https://i.imgur.com/2DDrxeu.png');
    diceImgMap.set(4, 'https://i.imgur.com/5EM7MFZ.png');
    diceImgMap.set(5, 'https://i.imgur.com/9QHlg4x.png');
    diceImgMap.set(6, 'https://i.imgur.com/hYMjFso.png');
    const resultString = () => {
      return (
        `\u200B\n` +
        `結果為 \`${dice}\` 點 \n` +
        `你${result ? '贏得了' : '損失了'} ${Math.abs(gaining)} ${emoji} \n` +
        `你現在籌碼數量為${total} ${emoji} \n`
      );
    };
    //gain exp

    const xp = require('../utility/xp');
    xp.add(msg, inputLeverage);

    // prettier-ignore
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(diceImgMap.get(dice))
      .addField('Dice', resultString())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max + 1);
};
