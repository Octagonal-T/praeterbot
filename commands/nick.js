const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
module.exports={
	name: "nick",
	aliases: ['nickname'],
	format: 'nick <@user> <new nick>',
	description: 'Changes someone\'s nickname',
	permissions: ['MANAGE_NICKNAMES'],
	myPermissions: ['MANAGE_NICKNAMES'],
	args: true,
	category: 'Moderation',
	async run(msg, args, client){
		let member = msg.mentions.members.first()
		if(!member){
			member = await getUser(msg.guild, args[0], false, client)
		}
		if(!member){
			return msg.channel.send("You need to mention someone for me to change!")
		}
		if(member.id == msg.guild.owner.id) return msg.channel.send("You can't change the nickname of the server owner!")
		const memberHighestRole = member.roles.highest
		const msgAuthorHighestRole = msg.member.roles.highest
		const myHighestRole = msg.guild.me.roles.highest
		if(msg.guild.owner.id !== msg.author.id){
			if(memberHighestRole.position >= msgAuthorHighestRole.position) return msg.channel.send("You don't have permission to change the nickname of someone of equal heirchiary.")
		}
		if(myHighestRole.position <= memberHighestRole.position){
			return msg.channel.send("I don't have permission to change the nickname of someone higher on the heirchiary than me.")
		}
		args.shift()
		member.setNickname(args.join(" "))
		msg.channel.send(`Set **${member.user.tag}**'s nickname to **${args.join(" ")}**`)
	}
}