const { Client, Intents, Collection } = require('discord.js');
const admin = require('firebase-admin');
const myIntents = new Intents(32767);
const client = new Client({ intents: myIntents });
//init commands collection from command folder
client.commands = new Collection();
client.events = new Collection();
//init handler
const handlerAry = ['command_handler', 'event_handler'];
handlerAry.forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
//init real-time db
const serviceAccount = require('./configs/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sodium-burner-326201-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const { token } = require('./configs/token.json');
client.login(token);
