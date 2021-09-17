module.exports = {
  name: 'clear',
  description: 'this is a clear command!',
  aliases: ['cl', 'c'],
  prems: ['MANAGE_MESSAGES'],
  async execute(msg, args, client) {
    const emoji = client.emojis.cache.get('738680578974548038');
    if (args[0]) {
      if (isNaN(args[0])) {
        return msg.reply(`參數只支援數字 你再瞎雞巴輸入我就幹你 ${emoji}`);
      }
      if (args[0] > 99 || args[0] == 0) {
        return msg.reply('請確認數字範圍在 `1` ~ `100` 之間 ');
      }
    }
    const count = parseInt(!args[0] ? 5 : args[0]);
    await msg.delete(); // delete the command that user input
    await msg.channel.messages.fetch({ limit: `${count}` }).then((msgs) => {
      msg.channel.bulkDelete(msgs);
    });

    await msg.channel.send(`已刪除 \`${!args[0] ? 5 : args[0]}\` 筆訊息`).then(() => {
      setTimeout(() => {
        msg.channel.bulkDelete(1);
      }, 2000);
    });
  },
};
