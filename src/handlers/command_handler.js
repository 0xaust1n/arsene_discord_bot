const fs = require('fs');
//global data
const commandList = [];

const event_handler = (client, Discord) => {
  const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if (command.name) {
      client.commands.set(command.name, command);
      commandList.push(command.name);
    } else {
      continue;
    }
  }
};

module.exports = event_handler;
