const {MessageEmbed} = require('discord.js')
module.exports = {
	name: 'purge',
	aliases: ['clear'],
	args: true,
	myPermissions: ['MANAGE_MESSAGES'],
	category: 'Moderation',
	permissions: ['MANAGE_MESSAGES'],
	format: 'purge <num>',
	description: 'Clear a amount of messages from the chat',
	async run(msg, args, client){
		if(isNaN(args[0])) return msg.channel.send("You need to include a *number* to purge!")
		if(args[0] > 100) return msg.channel.send("I cannot purge more than 100 messages at once!")
		if(args[0] < 1) return msg.channel.send("I need at least one message to purge!")
		await msg.delete()
		msg.channel.bulkDelete(args[0]).then(async message => {
			const clearedEmbed = new MessageEmbed()
				.setTitle("Purged!")
				.setColor("RED")
				.setDescription(`Purged **${args[0]}** amount of messages!`)
			let clearMessage = await msg.channel.send(clearedEmbed)
			setTimeout(() => {
				clearMessage.delete()
			}, 3000)
		}).catch(() => {
			msg.channel.send("I can't delete message older than two weeks!")
		})
	}
}