const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'KEY';
var unirest = require('unirest');

bot.on('ready', () => {
  console.log('I am awaited in Valhalla. v0.1');
});

bot.on('message', message => {
  var BotCheck = message.author.bot;

  if (BotCheck === false) {
    var messageIndex = message.content.indexOf('[[');

    if (messageIndex != -1) {
      var LeftString = message.content.indexOf('[[');
      var RightString = message.content.indexOf(']]');
      var CardName = message.content.substring(LeftString+2, RightString);
      //Better if I instead make a DB Call instead of API?
      var CardCall = "https://omgvamp-hearthstone-v1.p.mashape.com/cards/" + CardName + "?locale=enUS";

      unirest.get(CardCall)
      .header("X-Mashape-Key", "KEY")
      .header("Accept", "application/json")
      .end(function (result) {
        var CallSuccess = result.status;
        //Why are some cards not working even with a successful call?
        if (CallSuccess === 200) {
          message.channel.sendFile(result.body[0]["imgGold"]);
        }
        else {
          message.channel.sendMessage("A Card called " + CardName  + " was not found!")
        }
      });
    }
  }
});

bot.login(token);
