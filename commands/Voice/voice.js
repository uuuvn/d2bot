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
    .setAuthor(`${bot.user.username} Voice`, bot.user.displayAvatarURL)
    .setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
    .setTimestamp();
  if (args[0] == "create") {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      embed.setDescription("Ты не можешь сделать этого!");
      return message.channel.send(embed);
    }
    if (args.length < 3) {
      embed.setDescription(module.exports.help.usgae);
      return message.channel.send(embed);
    }
    let name = args.slice(1, args.length - 1).join(' ');
    let limit = args[args.length - 1];
    if (name.length <= 3 || name.length >= 16) {
      embed.setDescription("Имя канала должно быть больше 3 символов и меньше 16");
      return message.channel.send(embed);
    }
    if (!isNumeric(limit) || !(parseFloat(limit) === parseInt(limit, 10)) || ((limit < 2 || limit > 32) && parseInt(limit, 10) != -1)) {
      embed.setDescription("Лимит пользователей должен быть целым числом от 2 до 32 или -1!");
      return message.channel.send(embed);
    }
    limit = parseInt(limit);
    try {
      message.guild.channels.create(name, { type: "category" }).then((category) => {
        if (limit == -1) {
          message.guild.channels.create(name, { type: "voice", parent: category });
        } else {
          message.guild.channels.create(name, { type: "voice", parent: category, userLimit: limit });
        }
        bot.db.RegCategory(category.id, name, limit);
      })
    } catch (e) {
      utils.log(e);
    }
  } else if (args[0] == "votekick") {
    if (message.mentions.members.size != 1) {
      embed.setDescription("Упомяни одного человека!");
      return message.channel.send(embed);
    }
    
    let tokick = message.mentions.members.first();
    let voice = message.member.voice.channel;
    if (tokick.id == message.member.id) {
      embed.setDescription("Ты сам себя кикнуть решил?Ну, тут только :durka: поможет!");
      return message.channel.send(embed);
    }
    if(tokick.permissions.has("ADMINISTRATOR")){
      embed.setDescription("Ты не можешь сделать этого!");
      return message.channel.send(embed);
    }
    if (!voice) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    if (!voice.parent) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    bot.db.IsRegistredCategory(voice.parentID).then((result) => {
      if (!result.bool) {
        embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
        return message.channel.send(embed);
      }

      embed.setDescription(`Кикнуть <@${tokick.id}>?(для голосования есть 3 минуты)`);
      message.channel.send(embed).then((msg) => {
        msg.react("✅").then((reaction => {
          const filter = (reaction) => reaction.emoji.name === '✅';
          const collector = msg.createReactionCollector(filter, { time: 180000 });
          collector.on('collect', r => {
            if (r.count >= (voice.members.size / 2)) {
              try {
                voice.createOverwrite(tokick, { CONNECT: false }).then((ch) => {
                  if (voice.id == tokick.voice.channelID) tokick.voice.kick();
                });
              } catch (e) {

              }
            }
          });
        }));
      })
    });
  } else if (args[0] == "kick") {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      embed.setDescription("Ты не можешь сделать этого, попробую votekick!");
      return message.channel.send(embed);
    }
    if (message.mentions.members.size != 1) {
      embed.setDescription("Упомяни одного человека!");
      return message.channel.send(embed);
    }
    let tokick = message.mentions.members.first();
    let voice = message.member.voice.channel;
    if (!voice) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    if (!voice.parent) {
      embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
      return message.channel.send(embed);
    }
    bot.db.IsRegistredCategory(voice.parentID).then((result) => {
      if (!result.bool) {
        embed.setDescription("Ты должен быть в автосоздоваемом голосовом канале!");
        return message.channel.send(embed);
      }
      voice.createOverwrite(tokick, { CONNECT: false }).then((ret) => {
        if (voice.id == tokick.voice.channelID) tokick.voice.kick();
      });
    });
  } else {
    embed.setDescription(module.exports.help.usage);
    return message.channel.send(embed);
  }
};

module.exports.help = {
  name: "voice",
  aliases: ["v"],
  description: "Эта комманда *ЧИТАТЬ ДАЛЕЕ*",
  usage: "create <Имена каналов> <лимит пользователей(-1 для откл)> | kick <@упоминание> | votekick <@упоминание>",
  category: "Voice",
};