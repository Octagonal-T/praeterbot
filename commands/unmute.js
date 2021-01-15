const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
const {muteRole} = require('../config')
module.exports={
	name: 'unmute',
	description: 'Unmutes a member',
	format: 'unmute <member> [reason]',
	args: true,
	aliases: [],
	category: 'Moderation',
	permissions: ['MANAGE_MESSAGES'],
	myPermissions: ['MANAGE_ROLES'],
	async run(msg, args, client){	
		const member = await getUser(msg.guild, args[0], false, client) || msg.mentions.members.first()
		if(!member) return msg.channel.send("You need to include a user for me to unmute!")
		if(!member.roles.cache.some(r => r.id == muteRole)) return msg.channel.send("This user is not muted!")
		member.roles.remove(muteRole)
		args.shift()
		msg.channel.send(`Unmuted **${member.user.tag}** for **${args.length ? args.join(" ") : "None"}**`)
		member.user.send(new MessageEmbed().setColor("BLUE").setTitle(`You have been unmuted from ${msg.guild.name}`).setDescription(`You have been unmuted from **${msg.guild.name}**\nReason: **${args.length ? args.join(" ") : "None"}**`))
	}
}