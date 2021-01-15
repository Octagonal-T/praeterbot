module.exports={
	name: 'fun-fact',
	description: 'Returns a fun fact',
	format: 'fun-fact',
	args: null,
	category: 'Fun',
	aliases: ['funfact', 'ff'],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		const funFact = require(`${__dirname}/../assets/funfact.json`)
    let randomNumber = Math.floor(Math.random()*funFact.random.length);
    msg.channel.send(funFact.random[randomNumber])
	}
}