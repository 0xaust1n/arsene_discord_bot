const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interact')
    .setDescription('Interact with the AI')
    .addStringOption((option) =>
      option.setName('message').setDescription('The message to send to the AI').setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');

    // Defer the reply if the API call might take more than 3 seconds
    await interaction.deferReply();

    try {
      const response = await axios.post('https://ai.cimera.app/interact', {
        user_id: 'test-123',
        message: message,
      });
      console.log(response.data);

      let responseText = '';
      if (typeof response.data === 'string') {
        responseText = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Try to find the text content in common fields
        responseText = response.data.reply || 
                       response.data.message || 
                       response.data.response || 
                       response.data.text || 
                       response.data.content ||
                       JSON.stringify(response.data);
      }

      const parsedData = parseAgentResponse(responseText);
      
      let replyContent = '';
      if (parsedData.length > 0) {
        // Format to match the user's expected output style (list of objects)
        replyContent = parsedData.map(item => JSON.stringify(item)).join('\n') + '\n' + JSON.stringify(response.data.usage);
      } else {
        replyContent = responseText; // Fallback to raw text if parsing fails
      }

      // Discord message limit check (2000 chars), truncate if needed
      if (replyContent.length > 2000) {
        replyContent = replyContent.substring(0, 1997) + '...';
      }

      await interaction.editReply(replyContent);
    } catch (error) {
      console.error(error.message);
      await interaction.editReply('There was an error while executing this command!');
    }
  },
};

function parseAgentResponse(responseText) {
  const parsedData = [];
  // Ensure responseText is a string before splitting
  if (typeof responseText !== 'string') return parsedData;

  const lines = responseText.trim().split('\n');
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    const parts = line.split('|');
    if (parts.length >= 3) {
      const type = parts[0].trim();
      const tag = parts[parts.length - 1].trim();
      const content = parts.slice(1, -1).join('|').trim();
      
      parsedData.push({ type, content, tag });
    }
  }
  
  return parsedData;
}
