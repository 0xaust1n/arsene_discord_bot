const { EmbedBuilder } = require('discord.js');
const { prefix } = require('../configs/configs.json');

module.exports = {
  name: 'help',
  aliases: ['?', 'h'],
  description: 'this is a help command!',
  execute(msg, args, client) {
    const adminCommands = () => {
      return `
      \`clear\`
      `;
    };

    const generalCommand = () => {
      return `
      \`help\` , \`ping\`
      `;
    };

    const gambleCommand = () => {
      return (
        `\`level\` , \`chips\` , \`jackpot\` , \`claimall\` \n` +
        `\`cooldown\` , \`reward\`  , \`coinflip\` , \`beg\`\n`
      );
    };
    const resultEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: '→詳細指令解釋點我',
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        url: 'https://github.com/austinbabe/arsene_discord_bot/blob/master/command_cht.md',
      })
      .setDescription(`目前指令前綴為: \`${prefix}\``)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '一般指令:', value: generalCommand() },
        { name: '管理員指令:', value: adminCommands() },
        { name: '賭博指令:', value: gambleCommand() }
      )
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
