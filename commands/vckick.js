module.exports = {
	name: 'vckick',
	aliases: ['voicechatkick', 'vcdisconnect', 'voicechatdisconnect'],
	format: 'vckick <@user> [reason]',
	args: true,
	description: 'Kicks someone from a voice chat',
	permissions: ['MOVE_MEMBERS'],
	category: 'Moderation',
	myPermissions: ['MOVE_MEMBERS'],
	async run(msg, args, client){
		const user = msg.mentions.members.first() ||	await msg.guild.members.cache.get(args[0]) || await msg.guild.members.cache.find(m => m.user.tag.toLowerCase() == args[0].toLowerCase()) || await msg.guild.members.cache.find(m => m.user.username.toLowerCase() == args[0].toLowerCase()) || msg.guild.member(client.users.cache.get(args[0]))
		if(!user) return msg.channel.send("You need to include a user for me to disconenct!")
		if(!user.voice.channel) return msg.channel.send("This user isn't in a voice channel!")
		channel = user.voice.channel.name
		args.shift()
		let reason;
		if(!args.length) reason = "None"
		else reason =args.join(" ")
		user.voice.setChannel(null, reason)
		msg.channel.send(`Disconnected **${user.tag}** from **${channel}** for **${reason}**`)
	}
}