const {MessageEmbed} = require('discord.js');
const CarouselEmbed = require('../carouselEmbed')
module.exports = {
	name: "help",
	format: "help [commandName]",
	description: 'Get help within commands',
	permissions: [],
	myPermissions: [],
	aliases: [],
	args: false,
	category: 'Info',
	async run(msg, args, client){
		if(args.length){
			const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
			if(!command || command.hideFromHelp) return msg.channel.send("Sorry, that command doesnt exist")
			const helpEmbed = new MessageEmbed()
				.setColor("BLUE")
				.setTitle("Help menu")
				.addField(command.name, command.description, false)
				.addField("Format", `\`\`\`${command.format}\`\`\``, false)
				.addField("Aliases", command.aliases.length ? "`" + command.aliases.join("`\n`") + "`" : "None")
				.addField("Category", command.category)
			msg.channel.send(helpEmbed)
		}else{
			let commands = client.commands.filter(c =>!c.hideFromHelp)
			let moderation = commands.filter(c => c.category.toLowerCase() == "moderation"),
				fun = commands.filter(c => c.category.toLowerCase() == "fun"),
				info = commands.filter(c => c.category.toLowerCase() == 'info'),
				other = commands.filter(c => c.category.toLowerCase() == 'other')
			const infoEmbed = new MessageEmbed()
				.setTitle("Info commands!")
				.setDescription(info.map(c => "`"+c.name+"`" + " - " + c.description))
				.setColor("RED")
			const funEmbed = new MessageEmbed()
				.setTitle("Fun commands!")
				.setDescription(fun.map(c => `\`${c.name}\` - ${c.description}`))
				.setColor("RED")
			const moderationEmbed = new MessageEmbed()
				.setTitle("Moderation commands!")
				.setDescription(moderation.map(c => `\`${c.name}\` - ${c.description}`))
				.setColor("RED")
			const otherEmbed = new MessageEmbed()
				.setTitle("Other commands!")
				.setDescription(other.map(c => `\`${c.name}\` - ${c.description}`))
				.setColor("RED")			
			const helpCarousel = new CarouselEmbed([infoEmbed,funEmbed,moderationEmbed,otherEmbed],msg).startCarousel()
		}
	}
}