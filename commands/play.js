const {
	Util
} = require('discord.js');

const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const fetch = require("node-fetch");

module.exports = {
	name: 'play',
	description: 'Play a song in your channel!',
	async execute(message) {
		const args = message.content.split(' ');
		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);

		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}

        let api = 'https://www.googleapis.com/youtube/v3/search';
        const part = 'snippet';
        const key = 'AIzaSyA1dIBKIpIH1Toc8U7pu-KWKiR-2tNSHCE';
        const maxResults = 1;

        api += '?part=' + part + '&key=' + key + '&maxResults=' + maxResults + '&q=' + message.content.replace(/^!search+/i, '');

        var response = await fetch(api)
            .then(response => response.json())
            .then(data => result = data)
            //.then(json => console.log(result))

        console.log(
            ' search query : ' + message.content.replace(/^!search+/i, '') +
            '\n api url : ' + api + '\n data : \n');

        console.log(response);

        yt_videoId = response.items[0].id.videoId;

		const songInfo = await ytdl.getInfo('https://www.youtube.com/watch?v=' + yt_videoId);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				this.play(message, queueContruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send('```' + `${song.title} has been added to the queue!` + '```');
		}
	},

	async play(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);
	
		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
	
		const dispatcher = serverQueue.connection.playOpusStream(await ytdlDiscord('https://www.youtube.com/watch?v=' + yt_videoId));

			dispatcher.on('end', () => {
				console.log('Music ended!');
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})

			dispatcher.on('error', error => {
				console.error(error);
			});
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);


		return message.channel.send('```' + `Playing: ${serverQueue.songs[0].title}` + '```');
	},

	async search_yt(q) {
        // includes
        const fetch = require("node-fetch");

        let api = 'https://www.googleapis.com/youtube/v3/search';
        const part = 'snippet';
        const key = 'AIzaSyA1dIBKIpIH1Toc8U7pu-KWKiR-2tNSHCE';
        const maxResults = 1;

        api += '?part=' + part + '&key=' + key + '&maxResults=' + maxResults + '&q=' + q;

        var response = await fetch(api)
            .then(response => response.json())
            .then(data => result = data)
            //.then(json => console.log(result))

        console.log(
            ' search query : ' + message.content.replace(/^!search+/i, '') +
            '\n api url : ' + api + '\n data : \n');

        console.log(response);

        yt_videoId = response.items[0].id.videoId;
        
		return 'https://www.youtube.com/watch?v=' + yt_videoId;
    }
};