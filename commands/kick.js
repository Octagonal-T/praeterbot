const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
module.exports={
	name: 'kick',
	format: 'kick <@user> [reason]',
	description: 'Kicks a person',
	permissions: ['KICK_MEMBERS'],
	myPermissions: ['KICK_MEMBERS'],
	category: 'Moderation',
	args: true,
	aliases: [],
	async run(msg, args, client){
		let member = msg.mentions.members.first()
		if(!member){
			member = await getUser(msg.guild, args[0], false, client)
		}
		if(!member) return msg.channel.send("You need to mention someone for me to kick!")
		if(member.user.id == msg.author.id) return msg.channel.send("You can't kick yourself mate")
		if(member.permissions.has("KICK_MEMBERS")) return msg.channel.send("You can't kick someone that has kick permissions")
		const memberHighestRole = member.roles.highest
		const msgAuthorHighestRole = msg.member.roles.highest
		const myHighestRole = msg.guild.me.roles.highest
		if(msg.guild.owner.id !== msg.author.id){
			if(memberHighestRole.position >= msgAuthorHighestRole.position) return msg.channel.send("You don't have permission to kick someone of equal heirchiary.")
		}
		if(myHighestRole.position <= memberHighestRole.position){
			return msg.channel.send("I don't have permission to kick someone higher on the heirchiary than me.")
		}
		args.shift();
		let reason = args.join(" ")
		if(!reason){
			reason = "none"
		}
		await member.user.send(`You have been kicked from **${msg.guild.name}** for **${reason}**, by **${msg.author.tag}**`)
		member.kick({reason: reason})
		msg.channel.send(`Kicked **${member.user.tag}**`)
	}
}