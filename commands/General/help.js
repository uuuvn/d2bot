const Discord = require("discord.js");
const { readdirSync } = require("fs");
const utils = require("../../utils");

module.exports.run = (bot, message, args) => {

	const embed = new Discord.MessageEmbed()
		.setColor("#2C2F33")
		.setAuthor(`${bot.user.username} Help`, bot.user.displayAvatarURL)
		.setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
		.setTimestamp();
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (bot.commands.has(command)) {
			cmd = bot.commands.get(command);
		}
		else if (bot.aliases.has(command)) {
			cmd = bot.commands.get(bot.aliases.get(command));
		}
		if(!cmd) return message.channel.send(embed.setTitle("Ты не верно указал название комманды!").setDescription(`Используй \`${bot.cnfm.config.prefix}help\` для просмотра списка комманд.`));
		command = cmd.help;
		embed.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} command help`);
		embed.setDescription([
			`❯ **Комманда:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Описание:** ${command.description || "No Description provided."}`,
			`❯ **Использование:** ${command.usage ? `\`${bot.cnfm.config.prefix}${command.name} ${command.usage}\`` : `\`${bot.cnfm.config.prefix}${command.name}\``} `,
			`❯ **Сокращения:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
			`❯ **Категория:** ${command.category ? command.category : "General" || "Misc"}`,
		].join("\n"));

		return message.channel.send(embed);
	}
	const categories = readdirSync("./commands/");
	embed.setDescription([
		`Доступные комманды для ${bot.user.username}.`,
		`Префикс бота: **${bot.cnfm.config.prefix}**`,
		"`<>` - обязательные параметры,`()` - опциональные параметры",
	].join("\n"));
	categories.forEach(category => {
		const dir = bot.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			if (true) embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
			else if (category !== "Developer") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
		}
		catch (e) {
			console.log(e);
		}
	});
	return message.channel.send(embed);
};

module.exports.help = {
	name: "help",
	aliases: ["h"],
	description: "Комманда помощи",
	usage: "(command name)",
	category: "General",
};