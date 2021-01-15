module.exports={
	name: 'guess',
	format: 'guess',
	args: false,
	description: 'Makes you guess a number form 1-10',
	aliases: [],
	category: 'Fun',
	myPermissions: [],
	permissions: [],
	async run(msg, args, client){
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
		const num = getRandomInt(1, 10)
		msg.channel.send("Guess a number!")
		const filter = (m) => m.author.id == msg.author.id
		msg.channel.awaitMessages(filter,
			{
				time: 6000, 
				max: 1, 
				errors: 
				['time']
			}
		).then((message) => {
			if(message.first().content == num){
				msg.channel.send("You guessed it correctly!")
			}else{
				msg.channel.send(`You guessed it incorrectly, it was ${num}`)
			}
		})
	}
}