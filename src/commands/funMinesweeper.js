const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const Minesweeper = require('discord.js-minesweeper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('Play a customizable game of minesweeper!')
        .addNumberOption(option =>
            option.setName('size')
            .setDescription('The size of the board')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('mines')
            .setDescription('How many mines will be placed on the board')
            .setRequired(true)),

    async execute(interaction) {
        const size = interaction.options.getNumber('size').toString()
        const mines = interaction.options.getNumber('mines').toString()

        if (parseInt(size) > 12) return interaction.reply(`This size you specified is too large, please select a number between 5 and 12`)
        if (parseInt(size) < 5) return interaction.reply(`The size you specified is too small, please select a number between 5 and 12.`)

        const minesweeper = new Minesweeper({
            rows: parseInt(size),
            columns: parseInt(size),
            mines: parseInt(mines),
            emote: 'boom',
            returnType: 'matrix',
        });

        const matrix = minesweeper.start();

        if (matrix == null) {
            response = "There was an error."
        }

        try {
            return await interaction.reply(`
\`Size: ${size}\`
\`Mines: ${mines}\`
                
${matrix.join('\n').replace(/,/g, '')}
                        
Make sure you specify a matrix size between 5 and 12.
The board might break with a size of 12 on non-andriod OS', this is a discord limitation.`)
        } catch (error) {
            interaction.reply("There was an errror. Try setting your mine count lower. If this doesn't fix anything, contact the devs")
            console.log(error)
        }
    },
}