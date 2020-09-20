/*
    startup.js
    Main file
    Author: uuuvn
*/
//Подключение библиотек
const utils = require("./utils.js");
const path = require('path');
const fs = require('fs');
const db = require("./database.js");
const cnfm = require("./confmngr.js");
const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true });
//const web = require("./web.js");
const e = require("express");
//Функция загрузки модулей
function load(dir) {
    fs.readdirSync(dir).forEach(dirs => {
        if (!fs.lstatSync(path.join(dir, dirs)).isDirectory()) return;
        // Ищем файлы .js
        const commands = fs.readdirSync(path.join(dir, dirs)).filter(files => files.endsWith(".js"));

        // Цикл по файлам
        for (const file of commands) {
            // Подключаем файл
            const pull = require(`${dir}/${dirs}/${file}`);
            // Проверка на дурака
            if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
                if (bot.commands.get(pull.help.name)) return utils.warn(`Two or more commands have the same name ${pull.help.name}.`);
                // Добавляем в коллекцию
                bot.commands.set(pull.help.name, pull);
                // Ииии, логируем
                utils.log(`Loaded command ${pull.help.name}!`, "startup.js");

            }
            else {
                // Руггаемся на ошибОчку
                utils.log(`Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`, "startup.js");
                continue;
            }
            // Чекаем сокращения
            if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
                pull.help.aliases.forEach(alias => {
                    // Проверка на дурака x2
                    if (bot.aliases.get(alias)) return utils.warn(`Two commands or more commands have the same aliases ${alias}`);
                    bot.aliases.set(alias, pull.help.name);
                });
            }
        }

    });
}

function init() {
    utils.log(`Loading discord module...`, "startup.js");
    //Инициалтзируем
    bot.commands = new Discord.Collection();
    bot.aliases = new Discord.Collection();
    bot.cnfm = cnfm;
    bot.db = db;
    bot.utils = utils;
    //Добавляем меня в овнеры
    bot.cnfm.config.forceowners.forEach(element => {
        bot.db.addOwner(element).then((e) => {
            utils.log("Added forceowner " + e, "startup.js");
        });
    });
    load(cnfm.config.commandsFolder);//Загружаем модули
    //web.start()//Стартуем веб сервер
    bot.on("ready", () => utils.log(`Logged as ${bot.user.tag}!\nDiscord module ready!`, "startup.js"));
    //Обработчик сообщений ^-^
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

        if (command) {
            if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("У бота нет прав администратора, бот не может работать!").catch((e) => { utils.log(e) });
            command.run(bot, message, args)
        }
    });
    //Обработка кика
    //Обработка голосовых каналов
    bot.on("voiceStateUpdate", async function (oldMember, newMember) {
        if (oldMember.channel) {
            //Человек ливнул или сменил канал
            if (oldMember.channel.parent) {
                bot.db.IsRegistredCategory(oldMember.channel.parentID).then((result) => {
                    let bool = result.bool;
                    if (!bool) return;
                    let empty = [];
                    let full = [];
                    oldMember.channel.parent.children.forEach((element) => {
                        if (element.members.size == 0) {
                            empty.push(element);
                            element.permissionOverwrites.forEach(element => {
                                element.delete().catch((e)=>{});
                            });
                        } else {
                            full.push(element);
                        }
                    });
                    if (empty.length > 1) {
                        empty.slice(1, empty.length).forEach(element => {
                            element.delete().catch((e)=>{});
                        });
                    }
                });
            }
        }
        if (newMember.channel) {
            //Человек зашёл или сменил канал
            if (newMember.channel.parent) {
                bot.db.IsRegistredCategory(newMember.channel.parentID).then((result) => {
                    let bool = result.bool;
                    let name = result.name;
                    let limit = result.limit;
                    if (bool) {
                        let needCreate = true;
                        newMember.channel.parent.children.forEach(element => {
                            if (element.members.size == 0) needCreate = false;
                        });
                        if (needCreate) {
                            if (limit == -1) {
                                newMember.guild.channels.create(name, { type: "voice", parent: newMember.channel.parentID }).catch((e)=>{});
                            } else {
                                newMember.guild.channels.create(name, { type: "voice", parent: newMember.channel.parentID, userLimit: limit }).catch((e)=>{});
                            }

                        }
                    }
                });
            }
        }
    })
    //Логинимся
    bot.login(cnfm.config.token).catch((e) => {
        utils.log(e.toString(), "startup.js");
    });
}

init();