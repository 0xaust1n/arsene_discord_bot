const { Client, Intents, Collection } = require('discord.js');
const myIntents = new Intents(32509);
const client = new Client({ intents: myIntents });
const { token } = require('./configs/token.json');
const prefix = '!';
const fs = require('fs');
const commandList = [];
//init commands collection from command folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  commandList.push(command.name);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//listener on message sended
client.on('messageCreate', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) {
    return; //escape the function
  }
  //seeking command
  const arg = msg.content.slice(prefix.length).split(/ +/);
  const command = arg.shift().toLocaleLowerCase(); //shift first element
  const command = client.commands.get(`${cmd}`) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));
  if (command) {
    command.execute(msg, arg, client);
  }
});

client.login(token);
