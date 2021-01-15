const config = require('../config')
const {MessageEmbed} = require('discord.js')
module.exports={
	name: 'suggest',
	aliases: [],
	format: 'suggest <suggestion>',
	description: 'Suggests something to the server!',
	permissions: [],
	myPermissions: ['MANAGE_WEBHOOKS'],
	category: 'Other',
	args: true,
	async run(msg, args, client){
		const suggestionsChannel = msg.guild.channels.cache.get(config.suggestionsChannel)
		if(!suggestionsChannel) return msg.channel.send("This server has suggestions disabled!")
		else{
			let webhooks = await suggestionsChannel.fetchWebhooks()
			let webhook = webhooks.first()
			if(!webhook){
				webhook = await suggestionsChannel.createWebhook(`${client.user.username} suggestions`, {
					avatar: client.user.displayAvatarURL()
				})
			}
			const suggestEmbed = new MessageEmbed()
				.setColor('RED')
				.setDescription(args.join(" "))
				.setFooter(msg.author.id)
			if (msg.attachments.first()){
				suggestEmbed.setImage(msg.attachments.first().proxyURL)
			}
			webhook.send({
				username: msg.member.displayName,
				avatarURL: msg.author.displayAvatarURL(),
				embeds: [suggestEmbed]
			})
			const filter = (m) => m.webhookID
			suggestionsChannel.awaitMessages(filter, {time: 6000, max: 1, errors: ['time']}).then(async (msgs) => {
				if(msgs.first().webhookID){
					await msgs.first().react('738162668661375066')
					await msgs.first().react('738162622960238593')
					await msgs.first().react('738162684251603018')
				}
			}).catch(()=> msg.channel.send("You didn't enter anything!"))
			msg.channel.send("Send the suggestion to the suggestion channel!");
		}
	}
}