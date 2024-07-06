const { Bot } = require("grammy");
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
  console.log("message receive");
  // Check for specific keywords
  if (ctx.message.text.includes("/help")) {
    ctx.reply(
      "<b>List of commands</b>\n\
\t\t\t\t<b style='color:blue'>/new_wallet:</b> create a new wallet for user\n\
\t\t\t\t<b style='color:blue'>/transact @username amount:</b> send a specific amount of money to user\n \
\t\t\t\t<b style='color:blue'>/balance:</b> get the user's balance from their wallet\n \
\t\t\t\t<b style='color:blue'>/history:</b> get the user's transaction history\n \ ",
      { parse_mode: "HTML" }
    );
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

// bot.catch((err) => {
//   const ctx = err.ctx;
//   console.error(`Error while handling update ${ctx.update.update_id}:`);
//   const e = err.error;
//   if (e instanceof GrammyError) {
//     console.error("Error in request:", e.description);
//   } else if (e instanceof HttpError) {
//     console.error("Could not contact Telegram:", e);
//   } else {
//     console.error("Unknown error:", e);
//   }
// });

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
console.log("Starting the bot");
// Start the bot.
bot.start();
