const http = require("http");
const port = process.env.PORT || 9000;

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/validation": {
      res.end(`Validation route @ ${port}`);
      break;
    }
    default: {
      res.end("U sure where are u ?");
      break;
    }
  }
});
try {
  server.listen(port, () => console.log(`Listening on port ${port}`));

  require("dotenv").config();
  const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    MessageEmbed,
    SlashCommandBuilder,
    PermissionsBitField,
    Permissions,
  } = require("discord.js");
  const { randomQuote } = require("./quotes.js");
  const Memer = require("random-jokes-api");

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const getTime = () => {
    let currDate = new Date();
    let hours = currDate.getHours();
    let minutes = currDate.getMinutes();
    let ap = hours >= 12 ? "PM" : "AM";
    if (hours > 12) hours -= 1;
    hours = hours + "";
    minutes = minutes + "";
    if (hours.length == 1) hours = "0" + hours;
    if (minutes.length == 1) minutes = "0" + minutes;
    return `${hours}:${currDate.getMinutes()} ${ap}`;
  };

  const getDate = () => {
    let currDate = new Date();
    let date = currDate.getDate();
    let month = currDate.getMonth();
    let year = currDate.getFullYear();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[month]} ${date}, ${year} (${date}-${month + 1}-${year})`;
  };

  client.on("ready", async (x) => {
    console.log(`${x.user.tag} is ready`);
    client.user.setActivity("Hello Everyone");

    // Define commands

    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("This is a ping command"),
      new SlashCommandBuilder()
        .setName("hello")
        .setDescription("This is a hello command")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to say hi to")
            .setRequired(false)
        ),
      new SlashCommandBuilder()
        .setName("bye")
        .setDescription("This is a bye command"),
      new SlashCommandBuilder()
        .setName("add")
        .setDescription("This command will add two numbers")
        .addNumberOption((option) =>
          option
            .setName("first_number")
            .setDescription("Enter first number")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("second_number")
            .setDescription("Enter second number")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("subtract")
        .setDescription("This command will subtract two numbers")
        .addNumberOption((option) =>
          option
            .setName("first_number")
            .setDescription("Enter first number")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("second_number")
            .setDescription("Enter second number")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("multiply")
        .setDescription("This command will multiply two numbers")
        .addNumberOption((option) =>
          option
            .setName("first_number")
            .setDescription("Enter first number")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("second_number")
            .setDescription("Enter second number")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("square")
        .setDescription("Calculates the square of a number")
        .addNumberOption((option) =>
          option
            .setName("number")
            .setDescription("Enter the number")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("date")
        .setDescription("Returns the current date"),
      new SlashCommandBuilder()
        .setName("time")
        .setDescription("Returns the current time"),
      new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Returns a random quote"),
      new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Returns a random meme"),
      new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists all available commands"), // Help command
    ];

    await client.application.commands.set(commands);

    console.log("Commands registered globally.");
  });
  client.on("guildCreate", (guild) => {
    const channel = guild.channels.cache.find((ch) => ch.name === "general");
    const gifURL =
      "https://media1.tenor.com/images/696126b61e6549f4929585268bf22170/tenor.gif?itemid=12150720";
    channel.send(
      embedMessage(
        "Thank you for adding me to the server!!",
        "",
        gifURL,
        0x9b539d
      )
    );
  });

  client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.find((ch) =>
      ["general", "chatterbox", "பொது"].includes(ch.name)
    );
    const gifURL =
      "https://i.pinimg.com/originals/d1/9f/43/d19f43eef8f62486f0add859b18f4852.gif";
    channel.send(
      embedMessage(
        "A Knight just joined the server",
        `Welcome to the server, ${member}`,
        gifURL,
        0x9b539d
      )
    );
  });

  client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      interaction.reply("Pong");
    }

    if (interaction.commandName === "hello") {
      const userOption = interaction.options.getUser("user");
      if (userOption) {
        interaction.reply(`Hello, ${userOption.toString()}!`);
      } else {
        interaction.reply("Hey there!");
      }
    }

    if (interaction.commandName === "bye") {
      interaction.reply("Have a great day, see you soon!");
    }

    if (interaction.commandName === "add") {
      const firstNumber = interaction.options.getNumber("first_number");
      const secondNumber = interaction.options.getNumber("second_number");
      const result = firstNumber + secondNumber;
      interaction.reply(
        `The sum of ${firstNumber} and ${secondNumber} is ${result}`
      );
    }

    if (interaction.commandName === "subtract") {
      const firstNumber = interaction.options.getNumber("first_number");
      const secondNumber = interaction.options.getNumber("second_number");
      const result = firstNumber - secondNumber;
      interaction.reply(
        `The result of ${firstNumber} - ${secondNumber} is ${result}`
      );
    }

    if (interaction.commandName === "multiply") {
      const firstNumber = interaction.options.getNumber("first_number");
      const secondNumber = interaction.options.getNumber("second_number");
      const result = firstNumber * secondNumber;
      interaction.reply(
        `The product of ${firstNumber} and ${secondNumber} is ${result}`
      );
    }

    if (interaction.commandName === "square") {
      const number = interaction.options.getNumber("number");
      const result = number * number;
      interaction.reply(`The square of ${number} is ${result}`);
    }
    if (interaction.commandName === "date") {
      interaction.reply(`Date : ${getDate()}`);
    }
    if (interaction.commandName === "time") {
      interaction.reply(`Time : ${getTime()}`);
    }
    if (interaction.commandName === "quote") {
      let getQuote = randomQuote();
      let description = `"${getQuote.quote}" \n- ${getQuote.author}`;
      interaction.reply(description, "", "", getQuote.color);
    }

    if (interaction.commandName === "meme") {
      interaction.reply(Memer.joke());
    }

    if (interaction.commandName === "help") {
      // Displaying help information
      const helpMessage = new EmbedBuilder()
        .setTitle("Available Commands")
        .setColor(0x00ae86)
        .setDescription("Here's a list of all available commands:")
        .addFields(
          { name: "/ping", value: "This is a ping command." },
          { name: "/hello", value: "Say hello to a user or to everyone." },
          { name: "/bye", value: "Say goodbye." },
          { name: "/add", value: "Add two numbers." },
          { name: "/subtract", value: "Subtract two numbers." },
          { name: "/multiply", value: "Multiply two numbers." },
          { name: "/square", value: "Calculate the square of a number." },
          { name: "/date", value: "Get the current date." },
          { name: "/time", value: "Get the current time." },
          { name: "/quote", value: "Get a random quote." },
          { name: "/meme", value: "Get a random meme." },
          { name: "/help", value: "List all available commands." }
        );
      interaction.reply({ embeds: [helpMessage] });
    }
  });

  client.login(process.env.TOKEN);
} catch (error) {
  console.log(error.message);
}
