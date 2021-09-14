const fs = require('fs');

const event_handler = (client, Discord) => {
  const load_dir = (dirs) => {
    const eventFiles = fs.readdirSync(`./src/events/${dirs}`).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require(`../events/client/${file}`);
      const event_name = file.split('.')[0];
      client.on(event_name, event.bind(null, Discord, client));
    }
  };

  ['client', 'guild'].forEach((e) => load_dir(e));
};

module.exports = event_handler;
