const { MessageEmbed } = require('discord.js');
const { prefix } = require('../configs/configs.json');

module.exports = {
  name: 'help',
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
      return `
      \`level\` , \`chips\` , \`jackpot\` , \`claimall\` \n\`cooldown\` , \`reward\`  , \`coinflip\` 
      `;
    };
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(
        '→詳細指令解釋點我',
        client.user.displayAvatarURL({ dynamic: true }),
        'https://github.com/austinbabe/arsene_discord_bot/blob/master/command_cht.md'
      )
      .setDescription(`目前指令前綴為: \`${prefix}\``)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addField('一般指令:', generalCommand())
      .addField('管理員指令:', adminCommands())
      .addField('賭博指令:', gambleCommand())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
