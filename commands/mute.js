const fs = require('fs')
const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
const ms = require('ms')
const {muteRole} = require('../config')
module.exports={
	name: 'mute',
	category: 'Moderation',
	format: 'mute <user> [time] [reason]',
	description: 'Mutes someone',
	aliases: [],
	permissions: ['MANAGE_MESSAGES'],
	myPermissions: ['MANAGE_ROLES'],
	args: true,
	async run(msg, args, client){
		const role = msg.guild.roles.cache.get(muteRole)
		if(!role)return msg.channel.send("This server does not have the mute roel!")
		const member = await getUser(msg.guild, args[0], false, client) || msg.mentions.members.first()
		if(!member) return msg.channel.send("Include a member to mute!")
		if(member.roles.cache.some(r => r.id == muteRole)) return msg.channel.send(`**${member.user.tag}** is already muted!`)
		member.roles.add(role)
		let time = 'Forever'
		if(args[1]){
			time = await ms(args[1])
			if(time){
				args.shift()
				args.shift()
			}else{
				args.shift()
				time = 'Forever'
			}
		}
		let reason = 'None'
		if(args[1]){
			reason = args.join(" ")
		}
		const mutedEmbed = new MessageEmbed().setColor("RED").setTitle(`You have been muted from ${msg.guild.name}!`).setDescription(`You have been muted from **${msg.guild.name}**\nTime: **${ms(time) ? ms(time) : "Forever"}**\nReason: **${reason}**`)
		member.user.send(mutedEmbed)
		msg.channel.send(`**${member.user.tag}** has been muted for **${ms(time) ? ms(time) : "Forever"}** for the reason **${reason}**`)
		if(!time==="Forever"){
			let currentMutes = await fs.readFileSync(`${__dirname}/../storage/muteTimeouts.json`)
			currentMutes = JSON.parse(currentMutes)
			const mute = {
				end: time + Date.now(),
				member: member.user.id,
				guild: msg.guild.id
			}
			currentMutes.push(mute)
			fs.writeFile(`${__dirname}/../storage/muteTimeouts.json`, JSON.stringify(currentMutes, null, 2), deleteFileCallback)
			function deleteFileCallback(error) {
				if (error) {
					client.log(`warn`, `Did not find the file`)
				}
			}
		}
	}
}