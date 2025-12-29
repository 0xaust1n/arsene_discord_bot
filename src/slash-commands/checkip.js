const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkip')
    .setDescription('Checks the bot\'s outbound IP address'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Query multiple services in case one is down or rate-limited
      const services = [
        'https://api.ipify.org?format=json',
        'https://ifconfig.me/all.json',
      ];

      let ipInfo = 'Could not retrieve IP';

      for (const service of services) {
        try {
          const response = await axios.get(service, { timeout: 5000 });
          if (response.data) {
             const ip = response.data.ip || response.data.ip_addr;
             if(ip) {
                 ipInfo = ip;
                 break;
             }
          }
        } catch (e) {
          console.error(`Failed to fetch IP from ${service}:`, e.message);
        }
      }

      await interaction.editReply(`The bot's outbound IP address is: 
${ipInfo}
`);
    } catch (error) {
      console.error(error);
      await interaction.editReply('Failed to check IP address.');
    }
  },
};
