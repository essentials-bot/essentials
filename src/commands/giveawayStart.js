const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const ms = require("ms")
const config = require("../config.json")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Starts a giveaway')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Select a channel')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
            .setDescription('How long the giveaway will last')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('winners')
            .setDescription('How many winners will be drawn')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('prize')
            .setDescription('What is being given away')
            .setRequired(true)),



    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const duration = interaction.options.getString('duration');
        const winners = interaction.options.getNumber('winners');
        const prize = interaction.options.getString('prize');
        const host = interaction.user.username + "#" + interaction.user.discriminator
        const member = interaction.member

        if (!member.permissions.has('MANAGE_MESSAGES') && !member.roles.cache.some((r) => r.name === "Giveaways")) return interaction.reply(`
    :boom: You need to have the \`MANAGE_MESSAGES\` permissions to start giveaways.
    `);

        if (isNaN(ms(duration))) return interaction.reply(`
    :boom: That was not a valid time!
    `)

    await interaction.deferReply()
    await wait(2500)
    await interaction.editReply(`:tada: The giveaway is starting in ${channel} now!`)

    interaction.client.giveawaysManager.start(channel, {
        duration: ms(duration),
        prize: prize,
        winnerCount: parseInt(winners),
        hostedBy: host,
        messages: {
            giveaway: ":tada: **GIVEAWAY** :tada:",
            giveawayEnded: ":tada: **GIVEAWAY ENDED** :tada:",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: `Congratulations, {winners}! You won the **${prize}**!`,
            embedFooter: "Giveaways",
            noWinner: "Not enough entrants to determine a winner!",
            hostedBy: `Hosted by: ${host}`,
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    });
            },
}