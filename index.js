require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { handleTerminalCommand } = require("./terminalCommand");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`${client.user.tag} is online`);
});

client.on("messageCreate", (message) => {
  handleTerminalCommand(client, message);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "Hi") {
    message.reply("Hello!");
  }
});

client.login(process.env.BOT_TOKEN);
