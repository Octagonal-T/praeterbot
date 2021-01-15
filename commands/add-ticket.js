module.exports={
	name: 'add-ticket',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: true,
	format: 'add-ticket <user>',
	description: 'Adds someone to the ticket',
	hideFromHelp:true,
	async run(msg,args, client){
		if(!msg.channel.name.startsWith('ticket-')) return
		const member = msg.mentions.users.first() || msg.guild.members.get(args.join(" ")).user
		if(!member) return msg.channel.send("You need to add ping a member for this to work!")
		await msg.channel.createOverwrite(member, {
			SEND_MESSAGES: true,
			VIEW_CHANNEL: true
		})
		msg.channel.send(`Alright, added **${member.tag}** to the ticket!`)
	}
}