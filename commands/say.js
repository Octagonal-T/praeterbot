module.exports={
	name: 'say',
	aliases: ['repeat'],
	format: 'say <args>',
	description: 'Repeats the args',
	permissions: [],
	category: 'Fun',
	myPermissions: ['MANAGE_MESSAGES'],
	args: true,
	async run(msg, args, client){
		if((msg.mentions.everyone && !msg.member.permissions.has('MENTION_EVERYONE'))|| (JSON.stringify(msg.mentions.roles).length && !msg.member.permissions.has('MENTION_EVERYONE'))) return msg.channel.send("You can't ping roles or everyone with the say command!")
		msg.delete()
		msg.channel.send(args.join(" "))
	}	
}