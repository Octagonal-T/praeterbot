const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
module.exports={
	name: 'avatar',
	format: 'avatar [user]',
	description: 'Gets the avatar of someone',
	aliases: ['av'],
	args: false,
	category: 'Info',
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		let user = await getUser(msg.guild, args.length ? args.join(" ") : "null", true, client) || msg.mentions.users.first() || msg.author
		msg.channel.send(new MessageEmbed().setTitle(`${user.tag}'s avatar`).setImage(user.displayAvatarURL({ dynamic: true, size: 512 })).setColor("RED"))
	}
}