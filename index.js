const Revolt = require("revolt.js");
const Discord = require("discord.js");
const Mongoose = require("mongoose");
const { DiscordToken, RevoltToken, Mongo } = require("./botconfig.json");
const Uploader = require("revolt-uploader"); // Thanks to ShadowLp174 for the cool package.
const RevoltClient = new Revolt.Client();
const DiscordClient = new Discord.Client({ intents: [Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildEmojisAndStickers], allowedMentions: { parse: ['users', 'roles'], repliedUser: false }, partials: [Discord.Partials.Channel, Discord.Partials.Message], restTimeOffset: 60, });
Mongoose.set('strictQuery', true)
Mongoose.connect(Mongo, { useNewUrlParser: true, useUnifiedTopology: true });
RevoltClient.Uploader = new Uploader(RevoltClient);
RevoltClient.config = require("./config");
require(`./handlers/event`)(RevoltClient, DiscordClient);
RevoltClient.loginBot(RevoltToken);
DiscordClient.login(DiscordToken);