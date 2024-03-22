function handleTerminalCommand(client, message) {
  if (!message || message.author.bot) return;

  // Command we execute from discord
  if (message.content.startsWith("!egg")) {
    const requiredRoleName = "Moderators";
    const requiredRole = message.guild.roles.cache.find(
      (role) => role.name === requiredRoleName,
    );

    if (!requiredRole) {
      message.channel.send(
        `The required role '${requiredRoleName}' was not found.`,
      );
      return;
    }

    // Pre-written commands
    const preWrittenCommands = {
      start: {
        command: ".\\startmine.sh",
        response: "Server started successfully.",
      },
    };

    // Extract the pre written command from the message
    const commandName = message.content.slice("!egg".length).trim();

    if (!commandName) {
      message.channel.send("Please provide a valid command to execute");
      return;
    }

    // Retrieve the terminal command and response based on the prewritten command
    const commandData = preWrittenCommands[commandName];

    if (!commandData) {
      message.channel.send(`Invalid command: ${commandName}`);
      return;
    }

    // Execute terminal command
    const { exec } = require("child_process");

    exec(commandData.command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        message.channel.send(`Error executing command: ${error.message}`);
        return;
      }

      const responseMessage = commandData.response;
      console.log(`response: ${responseMessage}`);
      message.channel.send(responseMessage);
    });
  }
}

module.exports = {
  handleTerminalCommand,
};
