console.log('====================================================================================================')

/*
 Packages
*/

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

const mongo = require('./mongo')

const badServerNames = ['advertising', 'ads', 'crypto', 'bitcoin', 'dogecoin', 'litecoin', 'eth', 'ether', 'ethereum', 'loli', 'cp', 'porn', 'child porn', 'sex', 'nsfw', 'gore', '18+', 'nigger' ,'nigga']

const client = new Client({
    intents: 30223,
    partials: ['MESSAGE', 'CHANNEL']
});

const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');

const commands = [];

const clientId = '955262542471643196';
const guildId = '947431014169460746';

const rest = new REST({
    version: '9'
}).setToken(process.env.TOKEN);

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

/*
Listeners
*/

client.on('guildCreate', async (guild) => {
    if (badServerNames.some(badName => guild.name.includes(badName))) {
        guild.leave()
            .then(g => console.log(`Left the guild ${g} as it included a bad name!`))
            .catch(console.error);
    } else {
        console.log(`I joined guild: ${guild}`)
    }
})

client.on('messageCreate', async (message) => {
    if (message.channel.type !== 'DM') return
    console.log(`${message.author.tag} said: ${message.content}`)
})

client.once('ready', async () => {
    await mongo().then(mongoose => {
        try {
            console.log("Connected to mongo")
        } finally {
            mongoose.connection.close()
        }
    })

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
            console.log('====================================================================================================')
        }
    })

});

/*
Refresh / Commands
*/

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log('Refreshing / commands');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            },
        );
        console.log('====================================================================================================')
        console.log('All / commands reloaded');
    } catch (error) {
        console.error(error);
    }
})();

/* 
Giveaway Management
*/

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "????"
    }
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});

/*
Commnad Handling
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

/*
Logging in
*/

const release = 0;
console.log('====================================================================================================')

if (release === 0) console.log(`LOGGING INTO STABLE CLIENT`), client.login(process.env.TOKEN);
if (release === 1) console.log(`LOGGING INTO BETA CLIENT`), client.login(process.env.TOKEN2);