const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Display help information.',
    async execute(message, args) {
        // Random Tips
        const tips = [
            'Use "Z" to using another commands',
            'The bot is still in development, so some commands may not work properly.',
            'The bot will add more command!',
            'The owner love egg and egg is love',
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        // Help Embed
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('**BOT STATUS**')
            .setAuthor({ 
                name: message.author.username, 
                iconURL: message.author.displayAvatarURL({ dynamic: true }) 
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true })) // some thumbnail for the embed, u can change it to whatever u want, i just use the server icon for fun
            // Main content
            .addFields(
                { name: 'Bot Name', value: message.client.user.tag, inline: true },
                { name: 'Version:', value: `v0.0.0 Alpha`, inline: true },
                { name: 'Update:', value: '```- Adding bot wtf u expect```', inline: false } // Đổi inline thành false để dễ nhìn
            )
            .setFooter({ text: `Tip: ${randomTip}` })
            .setTimestamp();

        // Select menu
        const Menu = new StringSelectMenuBuilder()
            .setCustomId('help_slt')
            .setPlaceholder('Select a category')
            .addOptions(
                {
                    label: 'gau gau',
                    description: 'Information about dogs',
                    value: 'gau1',
                    emoji: '🐶'
                },
                {
                    label: 'Commands',
                    description: 'Basic bot commands',
                    value: 'gau2',
                    emoji: '📜'
                },
                {
                    label: 'Other',
                    description: 'Unknown selection',
                    value: 'gau3',
                    emoji: '❓' 
                },               
            );

        const row = new ActionRowBuilder().addComponents(Menu);

        // Send the embed with the select menu
        const response = await message.channel.send({
            embeds: [helpEmbed],
            components: [row],
        });

        // Collector listening for menu interactions
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000 
        });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: 'Only the author of the message can use this menu.', ephemeral: true });
            }

            let sltMenu = new EmbedBuilder().setTimestamp().setColor(0x5865F2);

            switch (interaction.values[0]) {
                case 'gau1': // Information about command niga
                    sltMenu
                        .setTitle('Gau Gau')
                        .setDescription('Gau gau is a dog 🐶')
                        .setFooter({ text: `Tip: ${randomTip}` });
                    break;
                case 'gau2':
                    sltMenu // what u expect for this one
                        .setTitle('Commands List')
                        .setDescription('Here are the commands: \n- `ping`: Test the bot\'s latency.\n- `help`: Display help information.')
                        .setFooter({ text: `Tip: ${randomTip}` });
                    break;
                case 'gau3':
                    sltMenu
                        .setTitle('Unknown') // literally unknown
                        .setDescription('This is a mystery category!')
                        .setFooter({ text: `Tip: ${randomTip}` });
                    break;
            }

            // Update the message with the new embed based on the selection
            await interaction.update({ embeds: [sltMenu] });
        });

        // Disable the menu after the collector ends
        collector.on('end', () => {
            row.components[0].setDisabled(true);
            response.edit({ components: [row] }).catch(() => {});
        });
    },
};