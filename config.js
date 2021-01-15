module.exports = {
	prefix: "p?", //change the prefix
	token: process.env.token, //put your bot token in a file called ".env"
	status: {
		status: 'online', //can be "idle", "online", "dnd", "offline"
		game: `for p?help`, //can be anything you want
		type: 'WATCHING' //can be "WATCHING", "PLAYING", "LISTENING", "STREAMING"
	},
	muteRole: '735851013063573535',
	suggestionsChannel: '737716479327207504', //channel id here
	autoMod: {
		autoModToggle: true,
		ignoreBots: true,
		blackListWords: true,
		blackListedWords: require('./blackListedWords'),
	}
}
/*
If you don't know how to turn on developer mode, or copy ids, read these articles

https://techswift.org/2020/09/17/how-to-enable-developer-mode-in-discord/
https://techswift.org/2020/04/22/how-to-find-your-user-id-on-discord/
*/
