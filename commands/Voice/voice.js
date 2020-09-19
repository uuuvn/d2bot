const Discord = require("discord.js");
const utils = require("../../utils");

function isNumeric(num){
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
    if(args.length < 3){
      embed.setDescription(module.exports.help.usgae);
      return message.channel.send(embed);
    }
    let name = args.slice(1,args.length - 1).join(' ');
    let limit = args[args.length - 1];
    if(name.length <= 3 || name.length >= 16){
      embed.setDescription("Имя канала должно быть больше 3 символов и меньше 16");
      return message.channel.send(embed);
    }
    if(!isNumeric(limit) || !(parseFloat(limit) === parseInt(limit, 10)) || ((limit < 2 || limit > 32) && parseInt(limit, 10) != -1)){
      embed.setDescription("Лимит пользователей должен быть целым числом от 2 до 32 или -1!");
      return message.channel.send(embed);
    }
    limit = parseInt(limit);
    try {
      message.guild.channels.create(name,{type:"category"}).then((category)=>{
        if(limit == -1){
          message.guild.channels.create(name,{type:"voice",parent: category});
        }else{
          message.guild.channels.create(name,{type:"voice",parent: category,userLimit: limit});
        }
        bot.db.RegCategory(category.id,name,limit);
      })
    } catch (e) {
      utils.log(e);
    }
  }
};

module.exports.help = {
  name: "voice",
  aliases: ["v"],
  description: "Эта комманда *ЧИТАТЬ ДАЛЕЕ*",
  usgae: "voice <create <Имена каналов> <лимит пользователей(-1 для откл)>>",
  category: "Voice",
};