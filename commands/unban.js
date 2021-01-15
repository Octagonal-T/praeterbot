const {MessageEmbed} = require('discord.js')
module.exports = {
	name: 'unban',
	format: 'unban <userID> [reason]',
	description: 'Unbans a person',
	permissions: ['BAN_MEMBERS'],
	myPermissions: ['BAN_MEMBERS'],
	args: true,
	aliases: [],
	category: 'Moderation',
	async run(msg, args, client){
		let bans = await msg.guild.fetchBans()
		if(bans.size == 0) return msg.channel.send("Your server doesn't have any bans!")
		let bUser = await bans.find(b => b.user.id == args[0]) || await bans.find(b => b.user.username.toLowerCase() === args[0].toLowerCase())
		if(!bUser) return msg.channel.send("That member isn't banned, or it's not even a member!")
		args.shift()
		let reason = args.join(" ")
		if(!reason){
			reason = "None"
		}
		msg.guild.members.unban(bUser.user, reason)
		msg.channel.send("Unbanned **" + bUser.user.tag + "** for **" + reason + "**");
	}
}