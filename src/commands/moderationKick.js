const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Kicks a user from the server')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user to kick')
			.setRequired(true))
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('The reason the member is being kicked')),


    async execute(interaction) {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
	let Reason = `${interaction.member.user.username}: ${interaction.options.getString('reason')}`
    const User = interaction.options.getMember('user')
    const Member = interaction.member
    let unix = Math.floor(interaction.createdAt / 1000)
    
  
    if (!Member.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content:"You cannot use this command, you need the permission `KICK_MEMBERS`", ephemeral: true });

    if (User.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content:"You cannot use this command, the user has a higher role than you", ephemeral: true });

    if (!User.kickable) return interaction.editReply({ content:"You cannot use this command, the user is not kickable by me. Try checking my role hierarchy or if I have permissions to do so.", ephemeral: true});

    if (!interaction.options.getString('reason')) Reason = `${interaction.member.user.username}: N/A`

    User.send(`You have been kicked from \`${interaction.guild.name}\` for \`${Reason}\``)
    
    interaction.reply(`<t:${unix}:R>: Successfully kicked \`${User.user.tag}\` from \`${interaction.guild.name}\`. They were kicked for \`${Reason}\``)

    console.log(`[${interaction.guild.name}] I just kicked ${User.user.tag} for ${Reason}`)

    await sleep(1000)

    User.kick(Reason)



    },
}