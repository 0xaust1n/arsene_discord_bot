const fs = require('fs');
const { Client, Intents, Collection, Discord } = require('discord.js');
const { token } = require('./configs/token.json');
const myIntents = new Intents(32509);
const client = new Client({ intents: myIntents });
//global data
const prefix = '!';
const commandList = [];
//init commands collection from command folder
client.commands = new Collection();
client.events = new Collection();

const handlerAry = ['command_handler', 'event_handler'];

handlerAry.forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

client.login(token);
