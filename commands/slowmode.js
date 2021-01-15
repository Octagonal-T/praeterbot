const ms = require('ms')
module.exports={
	name: 'slowmode',
	aliases: ['set-slowmode'],
	permissions: ['MANAGE_CHANNELS'],
	myPermissions: ['MANAGE_CHANNELS'],
	description: 'Changes the slowmode of a channel',
	format: 'slowmode <seconds> [channel] [reason]',
	category: 'Moderation',
	args: true,
	async run(msg, args, client){
		let channel;
		if(args[1]){
			channel =  msg.guild.channels.cache.get(args[1]) || msg.guild.channels.cache.find(c => c.name.toLowerCase() == args[1].toLowerCase()) || msg.mentions.channels.first() || msg.channel
		}else{
			channel = msg.channel
		}
		const time = args[0]
		if(isNaN(time)) return msg.channel.send(`**${time}** needs to be a number!`)
		if(channel.id != msg.channel.id){
			args.shift()
		}
		args.shift()
		let reason = args.join(" ")
		if(!reason) reason = "None"
		channel.setRateLimitPerUser(time, reason)
		msg.channel.send(`Set the slowmode of **${channel.name}** to **${time}** minutes for the reason **${reason}**!`)
	}
}