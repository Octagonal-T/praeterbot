const fs = require('fs')
const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
module.exports={
	name: 'warnings',
	description: 'Sees all the warnings you or the specified member has',
	format: 'warnings [user|warn id]',
	args: false,
	category: 'Info',
	aliases: ['warns'],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		if(msg.guild.id !=714109821502095397 && msg.guild.id!=717859707230093414) return msg.channel.send("Sorry, but this command is for Praeternaturals only!")
		let user = await getUser(msg.guild, args[0], true, client) || msg.mentions.users.first()
		let currentWarns = fs.readFileSync(`${__dirname}/../storage/warnings.json`, {encoding: 'utf-8'})
		currentWarns = JSON.parse(currentWarns)
		if(args[0] && !user){
			const compare = () => {
				let flag  = false
				Object.keys(currentWarns).forEach((key) => {
					const warn = currentWarns[key]
					for(i=0;i<warn.length;i++){
						if(warn[i].id===args[0]){
							flag = [warn[i], key]
						}
					}
				})
				return flag;
			}
			if(!compare()) return msg.channel.send("Invalid user/warn id!")
			const [warn, person] = compare()
			const member = msg.guild.members.cache.get(person) ? msg.guild.members.cache.get(person) : null
			const moderator = msg.guild.members.cache.get(warn.moderator)
			msg.channel.send(new MessageEmbed().setAuthor(member ? member.user.tag : '').setDescription(`Moderator: **${moderator ? moderator : "Not in server anymore!"}**\nReason: **${warn.reason}**\nID: **${warn.id}**\nPerson: **${member ? member.user.tag : 'Not in server anymore'}**`).setColor("RED"))
		}else{
			if(!user){
				user = msg.author
			}
			if(!currentWarns[user.id].length){
				msg.channel.send(`**${user.tag}** has no warnings!`)
			}else{
				const embed = new MessageEmbed()
					.setAuthor(user.tag, user.displayAvatarURL())
					.setDescription(`Warns for ${user.tag}`)
					.setColor('RED')
				for(const warn of currentWarns[user.id]){
					const moderator = msg.guild.members.cache.get(warn.moderator)
					embed.addField("\u200b", `Moderator: **${moderator ? moderator : "Not in server anymore!"}**\nReason: **${warn.reason}**\n Warn id: **${warn.id}**`)
				}
				msg.channel.send(embed)
			}
		}
	}
}