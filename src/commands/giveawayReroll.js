const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('greroll')
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

    interaction.client.giveawaysManager.reroll(giveaway)
    .then(() => {
        interaction.reply('Giveaway rerolled!');
    })
    .catch((e) => {
        if (e.startsWith(`Giveaway with message ID ${giveaway} has not ended.`)) {
            interaction.editReply('This giveaway has not ended!');
        } else {
            console.error(e);
            interaction.editReply('An error occurred...');
        }
    });
    },
}