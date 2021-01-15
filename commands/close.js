module.exports={
	name: 'close',
	aliases: [],
	args: false,
	description: 'Closes the ticket',
	format: 'close',
	permissions: [],
	myPermissions: [],
	hideFromHelp:true,
	async run(msg, args, client){
  	if (!msg.channel.name.startsWith(`ticket-`)) return;
		msg.channel.lockPermissions();
		msg.channel.setParent(`736311898823458848`);
		msg.channel.send(`Archived this ticket!`)
		client.openTickets.delete(msg.author.id);
	}
}