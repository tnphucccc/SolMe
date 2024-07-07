const { Bot, InlineKeyboard } = require("grammy");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

require("dotenv").config();
dotenv.config();

// Create an instance of the `GoogleGenerativeAI` class and pass your API key to it.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN);

async function AIReply(description) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = description;

  const result = await model.generateContent(prompt);
  // const response = await result.response;
  const text = result.response.text();
  return text;
}

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.hears("hello", (ctx) => ctx.reply("hi, how can i help you?"));
// Handle other messages.
// Handling command
bot.command("help", (ctx) => {
  ctx.reply(
    "<b>Here is the list of commands I have:</b>\n\
\t\t\t\t<b style='color:blue'>/create_wallet:</b> create a new wallet for user\n\
\t\t\t\t<b style='color:blue'>/transact @username amount:</b> send a specific amount of money to user\n \
\t\t\t\t<b style='color:blue'>/balance:</b> get the user's balance from their wallet\n \
\t\t\t\t<b style='color:blue'>/history:</b> get the user's transaction history\n \
\t\t\t\t<b style='color:blue'>/update_wallet:</b> update username to match with our database\n  ",
    { parse_mode: "HTML", reply_parameters: { message_id: ctx.msg.message_id } }
  );
});

// Function to send a message with an inline button
bot.command("test", (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("Activate Bot", "activate_bot")
    .text("Test2", "test2");

  ctx.reply("Click the button below to activate the bot:", {
    reply_markup: keyboard,
  });
});

// Handle callback queries when the button is clicked
bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "activate_bot") {
    ctx.reply("You choose activate bot");
  } else if (ctx.callbackQuery.data === "test2") {
    ctx.reply("You choose test2");
  }
});

bot.command("update_wallet", async (ctx) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/${ctx.from.id}/update?name=${ctx.from.username}`
    );
    if (res.status == 404 && !res.data.success) {
      ctx.reply("You have not created a wallet yet, please create one first", {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
      return;
    }
    // ctx.reply(res.data.message)
    ctx.reply("Your wallet has been updated successfully");
  } catch (err) {
    ctx.reply("There was some error updating your wallet, please try again", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  }
});

bot.command("create_wallet", async (ctx) => {
  const userid = ctx.from.id;
  if (!ctx.from.username) {
    ctx.reply("Please set your username before creating a wallet", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:8000/${userid}/create?name=${ctx.from.username}`
    );
    if (res.data.success) {
      ctx.reply(`Wallet created successfully`, {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    } else {
      ctx.reply("You have already created a wallet", {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

bot.command("transact", async (ctx) => {
  // console.dir(ctx, {depth: Infinity});
  console.dir(ctx.message, { depth: Infinity });
  if (ctx.message.entities.length !== 2) {
    ctx.reply("Invalid syntax, please try again", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  } else {
    const splitEntity = ctx.message.text.trim().split(/\s+/);
    console.log(splitEntity);
    if (splitEntity.length !== 3)
      ctx.reply("Invalid syntax, please try again", {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    else if (splitEntity[2] < 0.1) {
      ctx.reply("You must transact at least 0.1", {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    } else {
      try {
        const res = await axios.get(
          `http://localhost:8000/${
            ctx.from.id
          }/transact?name=${splitEntity[1].substring(1)}&amount=${
            splitEntity[2]
          }`
        );
        console.log(res.data);
        if (!res.data.success) {
          console.log("Error occur");
          ctx.reply(res.data.message, {
            reply_parameters: { message_id: ctx.msg.message_id },
          });
        } else {
          ctx.reply("Transaction successful", {
            reply_parameters: { message_id: ctx.msg.message_id },
          });
        }
      } catch (error) {
        ctx.reply("There was some error transacting, please try again", {
          reply_parameters: { message_id: ctx.msg.message_id },
        });
      }
      // ctx.reply(
      //   `Transacts ${splitEntity[2]} to user ${ctx.message.text.substring(
      //     ctx.message.entities[1].offset,
      //     ctx.message.entities[1].offset + ctx.message.entities[1].length
      //   )}`,
      //   {
      //     reply_parameters: { message_id: ctx.msg.message_id },
      //   }
      // );
    }
  }
});

bot.command("balance", async (ctx) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/${ctx.from.id}/checkBal`
    );
    if (res.status == 404 && !res.data.success) {
      ctx.reply("You have not created a wallet yet, please create one first", {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
      return;
    }
    console.log(res.data);
    ctx.reply(`Your balance is: ${res.data.checkBalance} SOL`, {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  } catch (err) {
    ctx.reply("There was some error getting your balance, please try again", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  }
});

function formattedHistory(history) {
  return `Signature: ${history.signature}\n\
Transaction Timestamp: ${history.slot}\n\
Result: ${history.result}\n\
Gas Fee: ${history.fee}\n\n\n`;
}

bot.command("history", async (ctx) => {
  try {
    const res = await axios.get(`http://localhost:8000/${ctx.from.id}/history`);
    if (res.data.success) {
      const history_list = res.data.data;
      let reply_message = ""
      history_list.forEach(history => reply_message += formattedHistory(history));
      ctx.reply(reply_message, {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    }
  } catch (err) {
    ctx.reply("Fail to get your transaction history, please try again", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  }
});

bot.command("ask_ai", async (ctx) => {
  try {
    ctx.reply(await AIReply(ctx.message.text.substring(7)));
  } catch (err) {
    ctx.reply("Your request contains sensitive words, please try again");
  }
});

bot.on("message:text", async (ctx) => {
  console.log("Message using AI");
  try {
    ctx.reply(await AIReply(ctx.message.text.substring(7)));
  } catch (err) {
    console.log(err);
    ctx.reply("Your request contains sensitive words, please try again");
  }
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
console.log("Starting the bot");
// Start the bot.
bot.start();
