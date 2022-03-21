const { Client, Intents, Collection, MessageEmbed, Guild, Message} = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });
const dotenv = require(`dotenv`)
dotenv.config()
const fs = require('fs')
const { GiveawaysManager } = require('discord-giveaways');
client.on("ready", () => { //when bot starts
console.log("I'm online!") //console info
const botver = "1.0.0"; //bot version string
const serverNumb = client.guilds.cache.size //records how many servers the bot is in
const botProfile = client.user.tag //records the username and discriminator the bot is logged in as
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');



client.on('debug', console.log) //log debug messages
      .on('warn', console.log) //log warning messages
console.log('(Version ' + botver + ')');	//console info
console.log('Logged in as ' + client.user.tag)//console info
client.aliases = new Collection() //command handler
client.commands = new Collection() //command handler
require('./commandhandler')(client) //command handler

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateObj = new Date();
const month = monthNames[dateObj.getMonth()];
const day = String(dateObj.getDate()).padStart(2, '0');
const year = dateObj.getFullYear();
const botstarted = month +" " + day  + ', ' + year;
const hours = dateObj.getHours()
const minutes = dateObj.getMinutes()
const seconds = dateObj.getSeconds()

console.log('Bot started at ' + botstarted + " at " + hours + ":" + minutes + ":" + seconds)

/* 
Giveaway Start
*/
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});

/*
Giveaway End
*/

const info = {
    dateStarted: botstarted,
    timeStarted: hours + ":" + minutes + ":" + seconds,
    botver: botver,
    serverNumb: serverNumb,
    botProfile: botProfile 
}

const jsonString = JSON.stringify(info, null, 2)
console.log(jsonString)

fs.writeFile('info.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})});

client.on('ready', () => { //when bot starts
    client.user.setStatus('available') //change bot online/dnd/idle/offlien to online
    client.user.setActivity("https://github.com/essentials-bot/essentials", {
        type: "PLAYING"
      });
});

client.on("messageCreate", Message => {  //when a message is sent

    let Prefix = "+"
    let Args = Message.content.slice(Prefix.length).trim().split(/ +/g); //set args
    let Command = Args.shift().toLowerCase(); //turns Args into Command
    
    if (Message.content.startsWith(Prefix)) { //if a command is sent
        let CommandFile = client.commands.get(Command) || client.commands.get(client.aliases.get(Command)); //get the commandfile of the command

        if (CommandFile) { //if the commandfile exists
            CommandFile.run(client, Message, Args); //run the commandfile
        }     
    } else {} //otherwise, do nothing
});

/*
^ Commands

v Bot startup
*/



const releaseVer = 0 //Stable-0 Beta-1

if (releaseVer == 1) {
	client.login(process.env.TOKEN2); //beta
	console.log('Logging in under Beta token...') //log beta token login
}
else if (releaseVer == 0) {
	client.login(process.env.TOKEN); //stable
	console.log('Logging in under Stable token...') //log stable token login
}