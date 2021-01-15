module.exports={
	name: 'steal',
	description: 'Adds a external emoji, a included image, or a image url!',
	args: true,
	format: 'steal [name] <url or emoji>',
	permissions: ['MANAGE_EMOJIS'],
	myPermissions: ['MANAGE_EMOJIS'],
	aliases: [],
	category: 'Moderation',
	async run(msg, args, client){
		if(args.length == 1){
			if(msg.content.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)){
				let emojiArgs = args[0].slice(1)
				emojiArgs = emojiArgs.slice(0, -1)
				emojiArgs = emojiArgs.split(":")
				if(msg.guild.emojis.cache.get(emojiArgs[2])) return msg.channel.send("That emoji is part of the server!")
				msg.guild.emojis.create(`https://cdn.discordapp.com/emojis/${emojiArgs[2]}.${emojiArgs[0] == 'a' ? 'gif' : 'png'}`, emojiArgs[1]).then((emoji)=>{
						msg.channel.send(`${emoji} Added ${emoji.name} as an emoji!`)
				}).catch((e) => {
					msg.channel.send("There was an error in uploading the emoji! (Make sure you put the name in front of the emoji, that the file is under 256kb, and that the limit of emojis hasn't been used up!)")
				})
			}else{
				if(!msg.attachments.first()) return msg.channel.send("No emoji, link or attachment included.")
				else{
					msg.guild.emojis.create(msg.attachments.first().proxyURL, args[0]).then((emoji)=>{
						msg.channel.send(`${emoji} Added ${emoji.name} as an emoji!`)
					}).catch((e) => {
						msg.channel.send("There was an error in uploading the emoji! (Make sure you put the name in front of the emoji, that the file is under 256kb, and that the limit of emojis hasn't been used up!)")
					})
				}
			}
		}else if(args.length == 2){
			if(msg.content.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)){
				let emojiArgs = args[1].slice(1)
				emojiArgs = emojiArgs.slice(0, -1)
				emojiArgs = emojiArgs.split(":")
				if(msg.guild.emojis.cache.get(emojiArgs[2])) return msg.channel.send("That emoji is part of the server!")
				msg.guild.emojis.create(`https://cdn.discordapp.com/emojis/${emojiArgs[2]}.${emojiArgs[0] == 'a' ? 'gif' : 'png'}`, args[0]).then((emoji)=>{
						msg.channel.send(`${emoji} Added ${emoji.name} as an emoji!`)
				}).catch((e) => {
					msg.channel.send("There was an error in uploading the emoji! (Make sure you put the name in front of the emoji, that the file is under 256kb, and that the limit of emojis hasn't been used up!)")
				})
			}else{
				msg.guild.emojis.create(args[1], args[0]).then((emoji)=>{
						msg.channel.send(`${emoji} Added ${emoji.name} as an emoji!`)
				}).catch((e) => {
					msg.channel.send("There was an error in uploading the emoji! (Make sure you put the name in front of the emoji, that the file is under 256kb, and that the limit of emojis hasn't been used up!)")
				})
			}
		}else msg.channel.send("Could not upload that as an emoji")
	}
}