const fs = require('node:fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const dotenv = require("dotenv")
dotenv.config()
const {
    GiveawaysManager
} = require('discord-giveaways');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS]
});


const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');


const commands = [];

const clientId = '955262542471643196';
const guildId = '906468430494973954';

const rest = new REST({
    version: '9'
}).setToken(process.env.TOKEN);




client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


// Constants Done



client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("https://discord.gg/cQk2msf9pQ", {
        type: "PLAYING",
    })

    const botver = "1.0.0"; //bot version string
    const serverNumb = client.guilds.cache.size //records how many servers the bot is in
    const botProfile = client.user.tag //records the username and discriminator the bot is logged in as
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const botstarted = month + " " + day + ', ' + year;
    const hours = dateObj.getHours()
    const minutes = dateObj.getMinutes()
    const seconds = dateObj.getSeconds()
    const djp = "364902391717298181"
    const amplex = "245773250154594304"

    const info = {
        dateStarted: botstarted,
        timeStarted: hours + ":" + minutes + ":" + seconds,
        botver: botver,
        serverNumb: serverNumb,
        botProfile: botProfile,
        djp: `<@${djp}>`,
        amplex: `<@${amplex}>`,
    }

    const jsonString = JSON.stringify(info, null, 2)

    fs.writeFile('info.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })

});

/*
Refresh Start
*/

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


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

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});

/*
Giveaways End
*/

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});


const release = 0;

if (release === 0) console.log("LOGGING INTO STABLE CLIENT"), client.login(process.env.TOKEN);
if (release === 1) console.log("LOGGING INTO BETA CLIENT"), client.login(process.env.TOKEN2);
