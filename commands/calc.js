const math = require('mathjs')
const {MessageEmbed} = require('discord.js')
module.exports={
	name: 'calc',
	aliases: ['calculate'],
	format: 'calc <math equation>',
	description: 'Calculates something!',
	permissions: [],
	category: 'Other',
	myPermissions: [],
	args: true,
	async run(msg, args, client){
		let resp;
		try{
			resp = math.evaluate(args.join("  "))
		}catch{
			msg.channel.send(new MessageEmbed().setColor('RED').setTitle("Error!").setDescription("That's not a math equation!"))
			return
		}
		msg.channel.send(new MessageEmbed().setColor('GREEN').setTitle("Evaluated!").addField('Input:', `\`\`\`${args.join(" ")}\`\`\``).addField('Output:', `\`\`\`${resp}\`\`\``))
	}
}