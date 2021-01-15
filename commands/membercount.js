const {MessageEmbed} = require('discord.js')
module.exports = {
	name: "membercount",
	args: false,
	permissions: [],
	category: 'Info',
	myPermissions: [],
	aliases: ["usercount"],
	description: "Gets the membercount of the server",
	format: "membercount",
	async run(msg, args, client){
		const usercount = msg.guild.memberCount;
		const membercount = msg.guild.members.cache.filter(m => !m.user.bot).size;
		const botcount = msg.guild.members.cache.filter(m => m.user.bot).size;
		const memberEmbed = new MessageEmbed()	
			.setColor("RED")
			.setTitle(`${msg.guild.name}'s membercount`)
			.addField("Total membercount", usercount, true)
			.addField("Users", membercount, true)
			.addField("Bots", botcount, true)
		msg.channel.send(memberEmbed);
	}
}