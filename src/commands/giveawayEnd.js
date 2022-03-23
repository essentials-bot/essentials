const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('gend')
	.setDescription('Ends a specified giveaway')
	.addStringOption(option =>
		option.setName('giveaway')
			.setDescription('The message ID of a giveaway (right click message => copy ID)')
			.setRequired(true)),

    async execute(interaction) {
	const giveaway = interaction.options.getString('giveaway');
    const member = interaction.member

    if (!member.permissions.has('MANAGE_MESSAGES') && !member.roles.cache.some((r) => r.name === "Giveaways")) return interaction.reply(`
    :boom: You need to have the \`MANAGE_MESSAGES\` permissions to start giveaways.
    `);

    await interaction.client.giveawaysManager.end(giveaway).then(interaction.reply(`Ended giveaway **${giveaway}**`))
    .catch((e) => {
            if (e.startsWith(`Giveaway with message ID ${giveaway} has already ended.`)) {
                interaction.editReply('This giveaway has already ended!');
            } else {
                console.error(e);
                interaction.editReply('An error occurred...');
            }
        });
    },
}