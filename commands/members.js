const {MessageEmbed, MessageAttachment} = require('discord.js')
module.exports={
	name: 'members',
	format: 'members <role>',
	description: 'Maps all the members with the role (the # of members must be below 80 or it will turn to a .txt file)',
	args: true,
	category: 'Info',
	permissions: [],
	myPermissions: [],
	aliases: [],
	async run(msg, args, client){
		let role = msg.guild.roles.cache.find(r => r.name.toLowerCase() == `${args.join(" ").toLowerCase()}`) || msg.guild.roles.cache.get(args.join(" ")) || msg.mentions.roles.first()
		if(!role) return msg.channel.send("That's not a role, sorry mate")
		let members = role.members
		if(members.size >= 80){
			const membersAttachment = new MessageAttachment(Buffer.from(members.map(m => m.user.tag).sort().join("\n"), 'utf8'), `${role.name}.txt`)
			msg.channel.send(`There are ${members.size} members with that role`, membersAttachment)
		}else{
			const membersEmbed = new MessageEmbed()
				.setTitle(`Members with the role ${role.name}`)
				.setDescription(`There are ${members.size} members with that role\n\n${members.map(m => m.user.tag).sort().join("\n")}`)
				.setColor("RED")
			msg.channel.send(membersEmbed)
		}
	}
}