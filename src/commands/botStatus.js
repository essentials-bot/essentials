const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bstatus')
        .setDescription('Changes the status of the bot (DEVELOPER ONLY)')
        .addStringOption(option =>
            option.setName('status')
            .setDescription('What the bot is playing')
            .setRequired(true)),

    async execute(interaction) {
        const status = interaction.options.getString('status')

        if (interaction.user.id !== '364902391717298181' && interaction.user.id !== '245773250154594304') return interaction.reply({
            content: 'You are not allowed to use this command',
            ephemeral: true
        })

        if (status === "default") {
            interaction.client.user.setActivity("https://discord.gg/cQk2msf9pQ", {
                type: "PLAYING",
            })
            await interaction.reply(`Changed status to \`Playing https://discord.gg/cQk2msf9pQ\``)
        } else {
            interaction.client.user.setActivity(status, {
                type: "PLAYING",
            })

            await interaction.reply(`Changed status to \`Playing ${status}\``)

        }
    }
}