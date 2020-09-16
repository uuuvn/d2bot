/*
    startup.js
    Main file
    Author: uuuvn
*/
const utils = require("./utils.js");
const path = require('path');
const fs = require('fs');
const db = require("./database.js");
const cnfm = require("./confmngr.js");
const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true });

function load(dir) {
    fs.readdirSync(dir).forEach(dirs => {
        if (!fs.lstatSync(path.join(dir, dirs)).isDirectory()) return;
        // we read the commands directory for sub folders and filter the files with name with extension .js
        const commands = fs.readdirSync(path.join(dir, dirs)).filter(files => files.endsWith(".js"));

        // we use for loop in order to get all the commands in sub directory
        for (const file of commands) {
            // We make a pull to that file so we can add it the bot.commands collection
            const pull = require(`${dir}/${dirs}/${file}`);
            // we check here if the command name or command category is a string or not or check if they exist
            if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
                if (bot.commands.get(pull.help.name)) return utils.warn(`Two or more commands have the same name ${pull.help.name}.`);
                // we add the the comamnd to the collection, Map.prototype.set() for more info
                bot.commands.set(pull.help.name, pull);
                // we log if the command was loaded.
                utils.log(`Loaded command ${pull.help.name}!`);

            }
            else {
                // we check if the command is loaded else throw a error saying there was command it didn't load
                utils.log(`Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
                // we use continue to load other commands or else it will stop here
                continue;
            }
            // we check if the command has aliases, is so we add it to the collection
            if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
                pull.help.aliases.forEach(alias => {
                    // we check if there is a conflict with any other aliases which have same name
                    if (bot.aliases.get(alias)) return utils.warn(`Two commands or more commands have the same aliases ${alias}`);
                    bot.aliases.set(alias, pull.help.name);
                });
            }
        }

    });
}

function init() {
    utils.log(`Loading discord module...`);
    bot.commands = new Discord.Collection();
    bot.aliases = new Discord.Collection();
    bot.cnfm = cnfm;
    bot.db = db;
    bot.utils = utils;
    /*
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        utils.log(`Loading ${file} file...`);
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        utils.log(`Command ${command.name} loaded from file ${file}`);
    }
    */
    load(cnfm.config.commandsFolder);
    bot.on("ready", () => utils.log(`Logged as ${bot.user.tag}!\nDiscord module ready!`));
    bot.on("message", async message => {

        const prefix = bot.cnfm.config.prefix;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        let command;

        if (message.author.bot || !message.guild) return;

        if (!message.member) message.member = await message.guild.fetchMember(message.author);

        if (!message.content.startsWith(prefix)) return;

        if (cmd.length === 0) return;
        if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
        else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));
        
        if (command) command.run(bot, message, args);
    });
    bot.login(cnfm.config.token).catch((e) => {
        utils.log(e.toString(), "startup.js");
    });
}

init();