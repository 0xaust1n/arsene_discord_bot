const { Client, GatewayIntentBits, Collection } = require('discord.js');
const admin = require('firebase-admin');
require('dotenv').config();

const dbConfig = process.env.FIREBASE;
const serviceObject = JSON.parse(dbConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceObject),
  databaseURL: 'https://sodium-burner-326201-default-rtdb.asia-southeast1.firebasedatabase.app',
  databaseAuthVariableOverride: {
    uid: 'arsene_discord_bot',
  },
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
//init commands collection from command folder
client.commands = new Collection();
client.events = new Collection();
//init handler
const handlerAry = ['command-handler', 'event-handler', 'slash-handler', 'button-actions-handler'];
handlerAry.forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
//init real-time db

const token = process.env.TOKEN;
client.login(token);

// Simple HTTP server for Fly.io health checks
const http = require('http');
const port = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Health Check OK');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Health check server listening on port ${port}`);
});
