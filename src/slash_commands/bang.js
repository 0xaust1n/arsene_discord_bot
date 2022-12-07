const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('bang').setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('bang!bang!');
  },
};
