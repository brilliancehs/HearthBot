const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('./config.json');
const unirest = require('unirest');

var token = config.dev_token;
//var token = config.prod_token;

bot.on('ready', () => {
  console.log('I am awaited in Valhalla. v0.2.1');
  bot.user.setAvatar('./avatar.jpg');
  bot.user.setGame('!help for commands');
});

bot.on('message', message => {
  if (message.author.bot) return;
  //Better way to parse commands with two different sets of initators?

  if (message.content.startsWith(config.prefix + 'help')){
      //can I do this better?
      message.author.sendMessage('HearthBot v0.2.1 Help!');
      message.author.sendMessage('Current Available Commands:');
      message.author.sendMessage('[[Card Name]] : Return Golden Image of requested card');
  }
  //Friends Command (!friend add/list/remove) DB Dependant
  //Meta command (!meta) Unclear what it will do

  //Can I do this better?
  else if (message.content.indexOf('[[') != -1) {
    var LeftString = message.content.indexOf('[[');
    var RightString = message.content.indexOf(']]');
    var CardName = message.content.substring(LeftString+2, RightString);
    //Should be a MongoDB call
    var CardCall = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/' + CardName + '?locale=enUS';
    unirest.get(CardCall)
    .header('X-Mashape-Key', config.card_API_key)
    .header('Accept', 'application/json')
    .end(function (result) {
      var CallSuccess = result.status;
      if (CallSuccess === 200) {
        message.channel.sendFile(result.body[0]['imgGold']);
      }
      else {
        message.channel.sendMessage('A Card called ' + CardName + ' was not found!')
      }
    });
  }
});

bot.login(token);
