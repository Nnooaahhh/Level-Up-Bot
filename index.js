npm init -y
npm install discord.js

const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '/'; // You can change the command prefix if needed

// Map to store user coins
const userCoins = new Map();

// Map to store store items and their prices
const storeItems = new Map();

// Role IDs
const adminRoleId = '907847279619211304';
const storePanelCreatorRoleId = '1173815069700800605';
const allowedRoles = ['1173819203501965332']; // Add more role IDs if needed

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
  if (message.author.bot) return; // Ignore bot messages
  if (!message.guild) return; // Ensure the message is in a guild

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // Level Up Coins
  if (command === 'coin-give' && message.member.roles.cache.has(adminRoleId)) {
    const targetUser = message.mentions.users.first();
    const coinsToAdd = parseInt(args[0]) || 0;

    if (targetUser) {
      addCoins(targetUser.id, coinsToAdd);
      message.channel.send(`${coinsToAdd} Level Up Coins added to ${targetUser.username}`);
    } else {
      message.channel.send('Please mention a user.');
    }
  } else if (command === 'coin-remove' && message.member.roles.cache.has(adminRoleId)) {
    const targetUser = message.mentions.users.first();
    const coinsToRemove = parseInt(args[0]) || 0;

    if (targetUser) {
      removeCoins(targetUser.id, coinsToRemove);
      message.channel.send(`${coinsToRemove} Level Up Coins removed from ${targetUser.username}`);
    } else {
      message.channel.send('Please mention a user.');
    }
  } else if (command === 'store-panel-create' && message.member.roles.cache.has(storePanelCreatorRoleId)) {
    createStorePanel(message.channel);
  } else if (command === 'store-item-add' && allowedRoles.some(role => message.member.roles.cache.has(role))) {
    const itemName = args[0];
    const itemPrice = parseInt(args[1]);

    if (!itemName || isNaN(itemPrice)) {
      message.channel.send('Invalid usage. Please provide an item name and price.');
      return;
    }

    storeItems.set(itemName, itemPrice);
    message.channel.send(`Item "${itemName}" added to the store for ${itemPrice} Level Up Coins.`);
  }

  // Add more commands and features as needed...

});

function addCoins(userId, amount) {
  const currentCoins = userCoins.get(userId) || 0;
  userCoins.set(userId, currentCoins + amount);
}

function removeCoins(userId, amount) {
  const currentCoins = userCoins.get(userId) || 0;
  const newCoins = Math.max(0, currentCoins - amount);
  userCoins.set(userId, newCoins);
}

function createStorePanel(channel) {
  if (storeItems.size === 0) {
    return channel.send('The store is empty. Add items using /store-item-add command.');
  }

  const storeEmbed = new Discord.MessageEmbed()
    .setTitle('Store Items')
    .setDescription('Buy items using Level Up Coins.')
    .setColor('#3498db');

  storeItems.forEach((price, item) => {
    storeEmbed.addField(item, `${price} Level Up Coins`);
  });

  channel.send(storeEmbed);
}

// Login to Discord with your app's token
client.login('MTE3MzgxNzMwMzk4OTc2ODIyMg.G4SnFP.TZTcf2y6UQTloYHnU1z0WuLoYOV67jtLgJx3X0');
