const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'this is a coinflip command!',
  aliases: ['cf'],
  async execute(msg, args, client) {
    const leverage = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    const user = msg.author;
    if (args.length < 1) {
      msg.reply(`擲硬幣指令錯誤! \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }
    const acceptArgs = ['h', 'heads', 't', 'tails'];
    const input = args.shift().toLocaleLowerCase().substring(0, 1);
    if (!acceptArgs.includes(input)) {
      msg.reply(`擲硬幣參數錯誤! \n` + `範例: \`coinflip tails\`\n` + `請重新輸入`);
      return;
    }
    let inputLeverage = 0;
    // init user amount
    const currentLeverage = await leverage.get(user);
    const acceptAmountArgs = ['a', 'all'];
    if (!args.length) {
      msg.reply(`籌碼數量參數錯誤! 未輸入數量 \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }
    if (isNaN(args[0]) && !acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      msg.reply(`籌碼數量參數錯誤! 請輸入數字或是 **all** \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }

    if (parseInt(args[0]) <= 0) {
      msg.reply(`籌碼數量參數錯誤! 數量請大於0 \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }

    if (currentLeverage == 0) {
      msg.reply(`籌碼數量錯誤! 籌碼為 0 \n` + `賭癮就先緩緩吧少年~`);
      return;
    }

    if (acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      inputLeverage = currentLeverage;
    } else {
      inputLeverage = Math.floor(parseInt(args.shift()));
    }

    const isEnough = currentLeverage >= inputLeverage ? true : false;
    if (!isEnough) {
      msg.reply(
        `籌碼數量錯誤! 沒有足夠的籌碼 \n` +
          `目前籌碼數量為 ${currentLeverage} ${emoji}\n` +
          `範例: \`coinflip tails 50\`` +
          `請重新輸入`
      );
      return;
    }

    //random flip result
    const flip = getRandomInt(2) === 1 ? 'h' : 't';
    const result = input == flip ? true : false;
    const gaining = result == true ? inputLeverage : -inputLeverage;
    const coinImgMap = new Map();
    const total = await leverage.add(user, gaining);
    coinImgMap.set('h', 'https://i.imgur.com/aO5MiC8.png');
    coinImgMap.set('t', 'https://i.imgur.com/I14nyiH.png');
    const resultString = () => {
      return (
        `\u200B\n` +
        `結果為**${flip == 'h' ? '正面' : '反面'}** \n` +
        `你${result ? '贏得了' : '損失了'} ${Math.abs(gaining)} ${emoji} \n` +
        `你現在籌碼數量為${total} ${emoji} \n`
      );
    };
    //gain exp

    const xp = require('../utility/xp');
    xp.add(msg, inputLeverage);

    // prettier-ignore
    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(coinImgMap.get(flip))
      .addFields({ name: 'Coinflip', value: resultString() })
      .setTimestamp();

    msg.reply({ embeds: [resultEmbed] });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max + 1);
};
