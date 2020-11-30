/*
    File: mute.js

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
const Discord = require("discord.js");
const parse = require('parse-duration');

/**
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 */
module.exports.run = (bot, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#2C2F33")
    .setAuthor(`${bot.user.username} Unmute`, bot.user.displayAvatarURL)
    .setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
    .setTimestamp();
    if(!message.member.hasPermission("MANAGE_GUILD")){
      embed.setDescription("Ты не можешь сделать этого!");
      return message.channel.send(embed);
    }
    if(message.mentions.members.size != 1){
      embed.setDescription("Ты должен указать 1 участника для затыкания!");
      return message.channel.send(embed);
    }
    let muted = message.mentions.members.first();

    if(message.member.id == muted.id){
      embed.setDescription("Ты не можешь сделать этого!");
      return message.channel.send(embed);
    }
    if(muted.guild.id != message.guild.id){
      embed.setDescription("Ошибка!");
      return message.channel.send(embed);
    }
    bot.emit("unmute",muted);
    embed.setDescription("Пользователь успешно размучен!");
    return message.channel.send(embed);
};

module.exports.help = {
  name: "unmute",
  aliases: [],
  description: "Эта комманда позволяет упомянотому пользоваель говорить",
  usage: "<@Упоминание>",
  category: "Moderation",
};