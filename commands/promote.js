const {getUser} = require('../getUser')
module.exports={
	name: 'promote',
	aliases: ['rp-promote', 'rppromote'],
	format: 'promote <member||student||tutor||instructor||lieutenant||officer||townsfolk> <user>',
	args: true,
	category: 'Other',
	description: 'Promotes someone in a roleplay',
	permissions: ['MANAGE_MESSAGES'],
	myPermissions: ['MANAGE_ROLES'],
	async run(msg, args, client){
		if(msg.guild.id !== '714109821502095397') return msg.channel.send("This server is not allowed to use this command!")
		let search = args[0].toLowerCase()
		args.shift()
		const member = await getUser(msg.guild, args.join(" "), false, client) || msg.mentions.members.first()
		if(!member) return msg.channel.send("You need to mention a member!")
		member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'roleplayer'))
		member.roles.remove(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'spectator'))
		member.roles.remove(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'no characters'))
		switch(search){
			case 'member':
				member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'optimist'))
				break;
			case 'tutor':
			case 'tutour':
				member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'tutor'))
				member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'paragon staff'))
				member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'paragon'))
				break;
			 case 'instructor':
			 	  member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'instructor'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'paragon staff'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'paragon'))
				  break
				case "townsfolk":
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'townsfolk'))
					break
				case "student":
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'paragon'))
					break
				case "lieutenant":
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'lieutenant'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'optimist'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'optimist council'))
					break
				case "officer":
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'officer'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'optimist'))
					member.roles.add(await msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'optimist council'))
					break
				default:
					msg.channel.send("Include a valid option!")
					return;
		}
		msg.channel.send(`**${member.user.tag}** is now promoted to **${search}**!!`)
	}
}