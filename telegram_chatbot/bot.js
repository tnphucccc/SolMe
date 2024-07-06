const { Bot, GrammyError, HttpError } = require("grammy");
const dotenv = require("dotenv");
dotenv.config();

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("7471327979:AAERKOHlsSqMFqe_8kNTaXbJcFxRhREH0ZA"); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.


// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message:text", async (ctx) => {
  // Check for specific keywords
  if (ctx.message.text.includes("help")) {
    ctx.reply("How can I help you?");
  } else if (ctx.message.text == "/count") {
    try {
      const memberCount = await ctx.api.getChatMemberCount(ctx.chat.id);
      ctx.reply(`There are ${memberCount} members in this group.`);
    } catch (error) {
      console.error("Failed to get member count:", error);
      ctx.reply("Sorry, I could not retrieve the member count.");
    }
  } else if (ctx.message.text.startsWith("/create_wallet")) {
    const userid = ctx.from.id;
    ctx.reply(
      `create wallet for user id: ${userid} with user name: ${ctx.from.username}`
    );
  } else if (ctx.message.text.startsWith("/transact")) {
    // console.dir(ctx, {depth: Infinity});
    console.dir(ctx.message, { depth: Infinity });
    if (ctx.message.entities.length !== 2) {
      ctx.reply("Invalid syntax, please try again");
    } else {
      const splitEntity = ctx.message.text.trim().split(/\s+/);
      console.log(splitEntity);
      if (splitEntity.length !== 3)
        ctx.reply("Invalid syntax, please try again");
      else if (splitEntity[2] < 0.1) {
        ctx.reply("You must transact at least 0.1");
      } else {
        ctx.reply(
          `Make transaction to user ${ctx.message.text.substring(
            ctx.message.entities[1].offset,
            ctx.message.entities[1].offset + ctx.message.entities[1].length
          )}`
        );
      }
    }
  } else if (ctx.message.text === "/balance") {
    ctx.reply(`Get balance from ${ctx.from.id} - ${ctx.from.username}`);
  } else if (ctx.message.text === "/history") {
    ctx.reply(`Get history from ${ctx.from.id} - ${ctx.from.username}`);
  } else {
    ctx.reply("Unknown command, please try again");
  }
});


// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
console.log("Starting the bot");
// Start the bot.
bot.start({
  // Make sure to specify the desired update types
  allowed_updates: ["chat_member", "message"],
});
