/*
    File: reload.js

    MIT License

    Copyright (c) 2020 uuuvn (Nikolay Voynilenko)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
const { readdirSync } = require("fs");
const { join } = require("path");
const Discord = require("discord.js");

module.exports.run = (bot, message, args) => {
	bot.db.isOwner(message.author.id).then((owner) => {
		const embed = new Discord.MessageEmbed()
			.setColor("#2C2F33")
			.setAuthor(`${bot.user.username} Reload`, bot.user.displayAvatarURL)
			.setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
			.setTimestamp();
		if (!owner) {
			embed.setDescription("Ты не можешь сделать этого!");
			return message.channel.send(embed);
		}
		if (!args[0]) {
			embed.setDescription("Укажи какую комманду перезагрузить!");
			message.channel.send(embed);
			return;
		}
		const commandName = args[0].toLowerCase();
		const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
		if (!command) {
			embed.setDescription("Такой комманды не существует!");
			message.channel.send(embed);
			return;
		}
		readdirSync(join(__dirname, "..")).forEach(f => {
			const files = readdirSync(join(__dirname, "..", f));
			if (files.includes(`${commandName}.js`)) {
				const file = `../${f}/${commandName}.js`;
				try {
					delete require.cache[require.resolve(file)];
					bot.commands.delete(commandName);
					const pull = require(file);
					bot.commands.set(commandName, pull);
					embed.setDescription(`Успешно перезагружен ${commandName}!`);
					return message.channel.send(embed);
				}
				catch (err) {
					embed.setDescription(`Не удалось перезагрузить: ${args[0].toUpperCase()}\``);
					message.channel.send(embed);
					return console.log(err.stack || err);
				}
			}
		});
	});
};

module.exports.help = {
	name: "reload",
	aliases: ["rl"],
	description: "Эта комманда позволяет перезагрузить модуль ^-^",
	usage: "<command name>",
	category: "Developer"
};