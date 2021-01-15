module.exports={
	name: '8ball',
	description: 'Gives you wisdom/advice on things',
	format: '8ball <args>',
	args: null,
	aliases: [],
	category: 'Fun',
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		const options=[
			'True',
			'False',
			'Perhaps',
			'*I don\'t know anymore, please leave me alone and let me cry in the corner.*',
			'***IMPOSSIBLE***',
		]
    msg.channel.send(options[Math.floor(Math.random()*options.length)])
	}
}