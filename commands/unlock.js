const {MessageEmbed} = require('discord.js')
module.exports={
	name: 'unlock',
	format: 'unlock [channel] [reason]',
	args: false,
	description: 'unlocks a channel down',
	permissions: ['MANAGE_CHANNELS'],
	myPermissions: ['MANAGE_CHANNELS'],
	category: 'Moderation',
	aliases: [],
	async run(msg, args, client){
		let channel = msg.channel
		let reason = "None";
		if(args.length){
			channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[1]) || msg.guild.channels.cache.find(c => c.name.toLowerCase() == args[0].toLowerCase())
			if(!channel) {
				channel = msg.channel
				reason = args.join(" ")
			}else{
				args.shift()
				if(args.length){
					reason = args.join(" ")
				}
			}
		}
		if(!channel.permissionOverwrites.get(msg.guild.id).deny.has('SEND_MESSAGES')){
			return msg.channel.send(new MessageEmbed().setColor("RED").setTitle("The channel was already unlocked!").setDescription(`${channel} was already unlocked!`))
		}else{
			channel.permissionOverwrites.get(msg.guild.id).update({
				SEND_MESSAGES: true,	
			})
			const lockedEmbed = new MessageEmbed()
				.setColor("BLUE")
				.setDescription("✅ Unlocked <#" + channel.id + ">!")
			msg.channel.send(lockedEmbed)
			const lockEMbed = new MessageEmbed()
				.setColor('RED')
				.setDescription(`🔒 ${reason}`)
				.setTitle("Channel unlocked")
			channel.send(lockEMbed)
		}
	}
}