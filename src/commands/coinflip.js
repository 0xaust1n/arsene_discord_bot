const { MessageEmbed } = require('discord.js');

const coinflip = {
  name: 'coinflip',
  description: 'this is a coinflip command!',
  execute(msg, args) {
    if (args.length < 1) {
      msg.channel.send(`擲硬幣指令錯誤! \n範例: \`coinflip tails\``);
      return;
    }
    const input = args.shift().toLocaleLowerCase().substring(0, 1);
    const acceptArg = ['h', 'heads', 't', 'tails'];

    if (!acceptArg.includes(input)) {
      msg.channel.send(`擲硬幣指令錯誤! \n範例: \`coinflip tails\``);
      return;
    }
    //random flip result
    const flip = acceptArg[getRandomInt(4)].substring(0, 1);
    const result = input == flip ? true : false;
    const coinImgMap = new Map();
    coinImgMap.set('h', 'https://i.imgur.com/aO5MiC8.png');
    coinImgMap.set('t', 'https://i.imgur.com/qt6tqBM.png');
    const resultString = () => {
      return `
      你猜的是${input == 'h' ? '正面' : '反面'}! 
      結果是${flip == 'h' ? '正面' : '反面'}!
      你${result ? '淫了' : '輸了'}!
      `;
    };
    // prettier-ignore
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(coinImgMap.get(flip))
      .addField('Coinflip', resultString())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

module.exports = coinflip;
