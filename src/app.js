const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./configs/token.json');
const myIntents = new Intents(32767);
const client = new Client({ intents: myIntents });
//init commands collection from command folder
client.commands = new Collection();
client.events = new Collection();

const handlerAry = ['command_handler', 'event_handler'];

handlerAry.forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(token);
