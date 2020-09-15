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
const client = new Discord.Client({ disableEveryone: true });


function init() {
    db.init();

    utils.log(`Loading discord module...`);
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.cnfm = cnfm;
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        utils.log(`Loading ${file} file...`);
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        utils.log(`Command ${command.name} loaded from file ${file}`);
    }
    client.on("ready", () => utils.log(`Logged as ${client.user.tag}!\nDiscord module ready!`));
    client.on("message", async message => {

        const prefix = client.cnfm.config.prefix;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const cmd = args.shift().toLowerCase();
    
        let command;
        if (message.author.bot || !message.guild) return;
        
        if (!message.member) message.member = await message.guild.fetchMember(message.author);

        if (!message.content.startsWith(prefix)) return;
        
        if (cmd.length === 0) return;
        if (client.commands.has(cmd)) command = client.commands.get(cmd);
        else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
    
        if (command) command.execute(client, message, args);
    });
    client.login(cnfm.config.token).catch((e) => {
        utils.log(e.toString(), "startup.js");
    });
}

init();