const Discord = require("discord.js");

module.exports.run = (bot, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("#2C2F33")
        .setAuthor(`${bot.user.username} Owner control`, bot.user.displayAvatarURL)
        .setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
        .setTimestamp();
    if (args[0] == "list") {
        bot.db.getOwners().then((list) => {
            list.forEach(id => {
                embed.addField("Owner", `<@${id}>`);
            });
            message.channel.send(embed);
        });
    } else if (args[0] == "add") {
        bot.db.isOwner(message.author.id).then((owner) => {
            if (!owner) {
                embed.setDescription("Ты не можешь сделать этого!");
                return message.channel.send(embed);
            }
            let users = message.mentions.users;
            let promises = [];

            if (users.size == 0) {
                embed.setDescription("Укажи хотябы 1 пользователя!");
                return message.channel.send(embed);
            }
            users.forEach((user) => {
                embed.addField("Added", `<@${user.id}>`);
                promises.push(bot.db.addOwner(user.id));
            });
            Promise.all(promises).then(() => {
                message.channel.send(embed);
            })
        });
    } else if (args[0] == "remove") {
        bot.db.isOwner(message.author.id).then((owner) => {
            if (!owner) {
                embed.setDescription("Ты не можешь сделать этого!");
                return message.channel.send(embed);
            }
            let users = message.mentions.users;
            let promises = [];

            if (users.size == 0) {
                embed.setDescription("Укажи хотябы 1 пользователя!");
                return message.channel.send(embed);
            }
            users.forEach((user) => {
                if(bot.cnfm.config.forceowners[user.id])return;
                embed.addField("Removed", `<@${user.id}>`);
                promises.push(bot.db.removeOwner(user.id));
            });
            Promise.all(promises).then(() => {
                message.channel.send(embed);
            })
        });
    } else {
        bot.db.isOwner(message.author.id).then((owner) => {
            if (!owner) {
                embed.setDescription("Ты не можешь сделать этого!");
                return message.channel.send(embed);
            } else {
                embed.setDescription(module.exports.help.usage);
                return message.channel.send(embed);
            }
        });
    }
};

module.exports.help = {
    name: "owner",
    aliases: ["ow"],
    description: "Настройка владельцев",
    usage: "<add <ping> | remove <ping> | list>",
    category: "Developer"
};