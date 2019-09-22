module.exports = {
	name: 'list',
	description: 'Get the song that is playing.',
	execute(message) {
        let str = '';
		const serverQueue = message.client.queue.get(message.guild.id);
        //if (!serverQueue) return message.channel.send('There is nothing playing.');

        for (i = 0; i < serverQueue.songs.length; i++)
            str += `${i+1} => Title: ${serverQueue.songs[i].title} \n`;

        //console.log(serverQueue);
        
		return message.channel.send('```' + str + '```');
	},
};