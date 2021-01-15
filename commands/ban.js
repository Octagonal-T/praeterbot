const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
module.exports={
	name: 'ban',
	format: 'ban <@user> [reason]',
	description: 'Bans a person',
	permissions: ['BAN_MEMBERS'],
	myPermissions: ['BAN_MEMBERS'],
	category: 'Moderation',
	args: true,
	aliases: [],
	async run(msg, args, client){
		let member = msg.mentions.members.first()
		if(!member){
			member = await getUser(msg.guild, args[0], false, client)
		}
		if(!member) return msg.channel.send("You need to mention someone for me to ban!")
		if(member.user.id == msg.author.id) return msg.channel.send("You can't ban yourself mate")
		if(member.permissions.has("BAN_MEMBERS")) return msg.channel.send("You can't ban someone that has ban permissions")
		const memberHighestRole = member.roles.highest
		const msgAuthorHighestRole = msg.member.roles.highest
		const myHighestRole = msg.guild.me.roles.highest
		if(msg.guild.owner.id !== msg.author.id){
			if(memberHighestRole.position >= msgAuthorHighestRole.position) return msg.channel.send("You don't have permission to ban someone of equal heirchiary.")
		}
		if(myHighestRole.position <= memberHighestRole.position){
			return msg.channel.send("I don't have permission to ban someone higher on the heirchiary than me.")
		}
		args.shift();
		let reason = args.join(" ")
		if(!reason){
			reason = "none"
		}
		await member.user.send(`You have been banned from **${msg.guild.name}** for **${reason}**, by **${msg.author.tag}**`)
		member.ban({reason: reason})
		msg.channel.send(`Banned **${member.user.tag}**`)
	}
}