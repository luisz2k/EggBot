require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { exec } = require("child_process");

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
  if (message.author.bot) {
    return;
  }

  if (message.content === "Hi") {
    message.reply("Hello!");
  }

  if (
    message.content === "mmhmm" ||
    message.content === "mmhm" ||
    message.content === "mhm"
  ) {
    message.reply("mmhmm mmhmm");
  }

  if (message.content === "!egg start") {
    exec(".\\startmine.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        message.channel.send(`Error executing command: ${error.message}`);
        return;
      }
      console.log(`response: Server started successfully.`);
      message.channel.send("Server started successfully.");
    });
  }

  if (message.content === "!egg status") {
    // Use tasklist command to list all running processes
    exec("tasklist", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing tasklist: ${error}`);
        message.reply("Error checking Minecraft server status");
        return;
      }

      // Check if java.exe is present in the tasklist output
      if (stdout.includes("java.exe")) {
        message.reply("Minecraft server is up and running");
      } else {
        message.reply("Minecraft server is off");
      }
    });
  }
});

client.login(process.env.BOT_TOKEN);
