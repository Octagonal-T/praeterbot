const {MessageEmbed} = require('discord.js')
module.exports={
	name: 'lockdown',
	format: 'lockdown [channel] [reason]',
	args: false,
	description: 'Locks a channel down',
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
		const boolean = channel.permissionOverwrites.get(msg.guild.id)?channel.permissionOverwrites.get(msg.guild.id).deny.has('SEND_MESSAGES'):false
		if(boolean){
			return msg.channel.send(new MessageEmbed().setColor("RED").setTitle("The channel was already locked!").setDescription(`${channel} was already locked!`))
		}else{
			if(boolean){
				channel.permissionOverwrites.get(msg.guild.id).update({
					SEND_MESSAGES: false,	
				})
				const lockedEmbed = new MessageEmbed()
					.setColor("BLUE")
					.setDescription("✅ Locked down <#" + channel.id + ">!")
				msg.channel.send(lockedEmbed)
				const lockEMbed = new MessageEmbed()
					.setColor('RED')
					.setDescription(`🔒 ${reason}`)
					.setTitle("Channel locked")
				channel.send(lockEMbed)
			}else{
				channel.createOverwrite(msg.guild.roles.everyone,{
					SEND_MESSAGES: false,	
				})
				const lockedEmbed = new MessageEmbed()
					.setColor("BLUE")
					.setDescription("✅ Locked down <#" + channel.id + ">!")
				msg.channel.send(lockedEmbed)
				const lockEMbed = new MessageEmbed()
					.setColor('RED')
					.setDescription(`🔒 ${reason}`)
					.setTitle("Channel locked")
				channel.send(lockEMbed)
			}
		}
	}
}