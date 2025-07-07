import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { exec } from "child_process";
import { publicIpv4 } from "public-ip";
import { spawn } from "child_process";

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

  // Egg commands

  // Start command
  if (msg === "!egg start") {
    const minecraftProcess = spawn(
      "C:/Users/luisz/OneDrive/Desktop/EggBot/startmine.bat",
    );

    message.channel.send("Starting Minecraft server...");

    minecraftProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      // Check for specific startup message in console output
      if (
        data.toString().includes("Done") ||
        data.toString().includes('For help, type "help"') ||
        data.toString().includes("Preparing spawn area")
      ) {
        message.channel.send(
          "Minecraft server started successfully! IP: " + ip_addr,
        );
      }
    });

    minecraftProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    minecraftProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
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
