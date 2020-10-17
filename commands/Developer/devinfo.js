const Discord = require("discord.js");

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ' hours ' + mins + ' mins ' + secs + ' seconds ' + ms + " ms";
}

module.exports.run = (bot, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#2C2F33")
    .setAuthor(`${bot.user.username} DevInfo`, bot.user.displayAvatarURL)
    .setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
    .setTimestamp();
  embed.addField("Connnect UpTime", msToTime(bot.uptime));
  return message.channel.send(embed);
};

module.exports.help = {
  name: "devinfo",
  aliases: ["di"],
  description: "Эта комманда показывает информацию для разработчиков",
  usage: "",
  category: "Developer",
};