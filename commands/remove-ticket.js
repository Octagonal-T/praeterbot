module.exports={
	name: 'remove-ticket',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: true,
	format: 'remove-ticket <user>',
	description: 'Removes someone to the ticket',
	hideFromHelp:true,
	async run(msg,args, client){
		if(!msg.channel.name.startsWith('ticket-')) return
		const member = msg.mentions.users.first() || msg.guild.members.get(args.join(" ")).user
		if(!member) return msg.channel.send("You need to add ping a member for this to work!")
		await msg.channel.createOverwrite(member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false
		})
		msg.channel.send(`Alright, removed **${member.tag}** from the ticket!`)
	}
}