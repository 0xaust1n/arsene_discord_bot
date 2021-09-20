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
      \`chips\` , \`jackpot\` , \`claimall\` , \`reward\`  , \`coinflip\` 
      `;
    };
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`目前指令前綴為: \`${prefix}\``)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addField('一般指令:', generalCommand())
      .addField('管理員指令:', adminCommands())
      .addField('賭博指令:', gambleCommand())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
