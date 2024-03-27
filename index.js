import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { exec } from "child_process";
import { publicIpv4 } from "public-ip";

dotenv.config();

let ip_addr;

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

  publicIpv4()
    .then((ip) => {
      ip_addr = ip;
      console.log("Ip address: " + ip);
    })
    .catch((error) => {
      console.error(error);
    });
});

client.on("messageCreate", (message) => {
  const msg = message.content;

  if (message.author.bot) {
    // do not execute commands if entered by a bot
    return;
  }

  if (
    msg.toLowerCase() === "mmhmm" ||
    msg.toLowerCase() === "mmhm" ||
    msg.toLowerCase() === "mhm"
  ) {
    message.reply("mmhmm mmhmm");
  }

  // Egg commands

  // Start command
  if (msg === "!egg start") {
    // Run the bash script to start the minecraft server
    exec(
      "C:/Users/luisz/OneDrive/Desktop/EggBot/startmine.bat",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          message.channel.send(`Error executing command: ${error.message}`);
          return;
        }
        console.log(`response: Server started successfully.`);
        // message.channel.send("Server started successfully.");  TODO: fix bug, msg sends after closing bash script
      },
    );
  }

  // Help command
  if (msg === "!egg help") {
    message.reply(
      "!egg start - to start the server\n!egg status - to check if the server is on or off\n!egg ip - check the server ip address",
    );
  }

  // Status command
  if (msg === "!egg status") {
    // Use tasklist command to list all running processes
    exec("tasklist", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing tasklist: ${error}`);
        message.reply("Error checking Minecraft server status");
        return;
      }

      // Check if the java exe is present in the tasklist
      if (stdout.includes("java.exe")) {
        message.reply("Minecraft server is up and running at " + ip_addr);
      } else {
        message.reply("Minecraft server is off");
      }
    });
  }

  if (msg === "!egg ip") {
    publicIpv4()
      .then((ip) => {
        ip_addr = ip;
        message.reply("IP address is: " + ip_addr);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

client.login(process.env.BOT_TOKEN);
