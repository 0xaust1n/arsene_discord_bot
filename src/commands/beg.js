module.exports = {
  name: 'beg',
  description: 'this is a beg command!',
  aliases: ['bg'],
  async execute(msg, args, client) {
    const emoji = client.emojis.cache.get('889219097752129667');
    const leverage = require('../utility/leverage');

    if (msg.mentions.users.first() == undefined) {
      return msg.reply(
        `乞討參數錯誤! 未選選取乞討對象! 指令範例:\`!beg @AustinBabe 100\``
      );
    }

    const papa = msg.mentions.users.first();
    if (papa.id == msg.author.id) {
      return msg.reply(`自己跟自己乞討是什麼概念? 請開始你的表演`);
    }

    const numberUtil = require('../utility/number');
    const papaChips = await leverage.get(papa);
    args[1] = numberUtil.numberParse(args[1], papaChips);

    if (isNaN(args[1])) {
      return msg.reply(
        `乞討參數錯誤! 第二個參數必須為數字 指令範例:\`!beg @AustinBabe 100\``
      );
    }

    if (parseInt(args[1]) <= 0) {
      return msg.reply(
        `乞討參數錯誤! 數字必須為大於0的數字 指令範例:\`!beg @AustinBabe 100\``
      );
    }

    const amount = parseInt(args[1]);

    if (amount > papaChips) {
      return msg.reply(`你爸爸 \`${papa.username}\` 他好像也沒有錢QQ`);
    }

    msg.channel.send(`請 <@${papa.id}> 在10秒內回復 \`YES\` 或是 \`NO\``);
    await leverage.get(msg.author);
    const filter = (m) => {
      return m.author.id == papa.id;
    };

    const collector = msg.channel.createMessageCollector({
      filter,
      time: 10000,
    });
    let isReply = false;
    collector.on('collect', (m) => {
      const reply = m.content;
      if (
        reply.toLocaleLowerCase() == 'yes' ||
        reply.toLocaleLowerCase() == 'y'
      ) {
        isReply = true;
        leverage.add(msg.author, amount);
        leverage.add(papa, amount * -1);
        return m.reply(
          `你爸爸 \`${papa.username}\` 給你了\`${amount}\` ${emoji}`
        );
      } else if (
        reply.toLocaleLowerCase() == 'no' ||
        reply.toLocaleLowerCase() == 'n'
      ) {
        isReply = true;
        return m.reply(`你爸爸 \`${papa.username}\` 拒絕你了`);
      }
    });
    collector.on('end', (collected) => {
      if (!isReply) {
        return msg.reply('請求超時!請求已經被自動回絕');
      }
    });
  },
};
