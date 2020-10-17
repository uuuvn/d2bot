const Discord = require("discord.js");
const utils = require("../../utils");

function isNumeric(num) {
  return !isNaN(num)
}
/**
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 */
module.exports.run = (bot, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#2C2F33")
    .setAuthor(`${bot.user.username} Personal Voice`, bot.user.displayAvatarURL)
    .setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
    .setTimestamp();
  if (args[0] == "create") {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      embed.setDescription("Ты не можешь сделать этого(ЭТА КОММАНДА ДЛЯ АДМИНОВ, ДЛЯ СОЗДАНИЯ СВОЕГО КАНАЛА ЗАЙДИ В КАНАЛ ДЛЯ СОЗДАНИЯ)!");
      return message.channel.send(embed);
    }
    if (args.length < 1) {
      embed.setDescription(module.exports.help.usgae);
      return message.channel.send(embed);
    }
    let name = args.slice(1, args.length).join(' ');
    if (name.length <= 3 || name.length >= 16) {
      embed.setDescription("Имя канала должно быть больше 3 символов и меньше 16");
      return message.channel.send(embed);
    }
    try {
      message.guild.channels.create(name, { type: "category" }).then((category) => {
        message.guild.channels.create("Создай свой канал!", { type: "voice", parent: category }).then((channel)=>{
          bot.db.RegPCategory(category.id,channel.id);
          embed.setDescription("Успешно!");
          return message.channel.send(embed);
        })
      })
    } catch (e) {
      utils.log(e);
    }
  }else if (args[0] == "kick") {
    let voice = message.member.voice.channel;
    if (!voice) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    if (!voice.parent) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    bot.db.IsRegistredPCategory(voice.parentID).then((result) => {
      if (!result.bool) {
        embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
        return message.channel.send(embed);
      }
      if (!message.member.permissionsIn(voice).has("MANAGE_CHANNELS")) {
        embed.setDescription("Ты не можешь сделать этого");
        return message.channel.send(embed);
      }
      if (message.mentions.members.size != 1) {
        embed.setDescription("Упомяни одного человека!");
        return message.channel.send(embed);
      }
      let tokick = message.mentions.members.first();
      voice.createOverwrite(tokick, { CONNECT: false }).then((ret) => {
        if (voice.id == tokick.voice.channelID) tokick.voice.kick();
      });
      embed.setDescription("Успешно!");
      return message.channel.send(embed);
    });
  } else {
    embed.setDescription(module.exports.help.usage);
    return message.channel.send(embed);
  }
};

module.exports.help = {
  name: "pvoice",
  aliases: ["pv"],
  description: "Эта комманда *ЧИТАТЬ ДАЛЕЕ*",
  usage: "create <Имя категории> | kick <@упоминание>",
  category: "Voice",
};