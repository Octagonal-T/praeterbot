const fs = require('fs')
const {MessageEmbed} = require('discord.js')
const {muteRole} = require('./config')
module.exports= {
	async update(client){
		let callBack = (e) => {if(e) {client.log('warn', e)}}
		let mutes1 = fs.readFileSync('./storage/muteTimeouts.json', {encoding: 'utf-8', flag: 'r'})
		let mutes = JSON.parse(mutes1)
		for(const mute of mutes){
			if(Date.now() >= mute.end){
				const guild = client.guilds.cache.get(mute.guild)
				if(!guild){
					mutes = mutes.splice(mutes.indexOf(mute), mutes.indexOf(mute))
					fs.writeFile('./storage/muteTimeouts.json', JSON.stringify(mute, null, 2), callBack)
				}
				else{
					const member = guild.members.cache.get(mute.member)
					if(!member || !member.roles.cache.some(r => r.id == muteRole)){
						mutes = mutes.splice(mutes.indexOf(mutes), mutes.indexOf(mutes))
						fs.writeFile('./storage/muteTimeouts.json', JSON.stringify(mutes, null, 2), callBack)
					}
					else{
						member.roles.remove(muteRole)
						member.user.send(new MessageEmbed().setColor("BLUE").setTitle(`You have been unmuted from ${guild.name}`).setDescription(`You have been unmuted from **${guild.name}**\nReason: **Mute time over**`))
						mutes = mutes.splice(mutes.indexOf(mute), mutes.indexOf(mute))
						fs.writeFile('./storage/muteTimeouts.json', JSON.stringify(mutes, null, 2), callBack)
					}
				}
			}
		}
	}
}