const fs = require('fs')

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	execute(message) {
		let str = '';
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		str += '====**** List of Commands ****====\n\n';

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			str += `[!${command.name}] => ${command.description} \n`;
		}

		message.channel.send('```' + str + '```');
	},
};