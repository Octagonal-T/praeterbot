const {getUser} = require('../getUser')
module.exports={
	name: 'vcmute',
	description: 'Mutes/unmutes someone in the VC',
	format: 'vcmute <@user|everyone> [reason]',
	aliases: ["voicechatmute"],
	permissions: ['MUTE_MEMBERS'],
	category: 'Moderation',
	myPermissions: ['MUTE_MEMBERS'],
	args: true,
	async run(msg, args, client){
		let member = msg.mentions.members.first() || await msg.guild.members.cache.get(args[0]) || await msg.guild.members.cache.find(m => m.user.tag.toLowerCase() == args[0].toLowerCase()) || await msg.guild.members.cache.find(m => m.user.username.toLowerCase() == args[0].toLowerCase()) || msg.guild.member(client.users.cache.get(args[0]))
		if(!member) {
			if(args[0] !== "everyone") return msg.channel.send("You need to include a person for me to mute, or everyone!")
			if(!msg.member.voice.channel) return msg.channel.send("You need to be in a voice channel to mute everyone!")
			let members = msg.member.voice.channel.members.map(u => u.user.id)
			args.shift()
			const reason = args.length ? args.join(" ") : "None" 
			for(i=0;i<members.length;i++){
				member = msg.guild.members.cache.get(members[i])
				if(member.voice.channel){
					if(member.voice.serverMute == true){
						await member.voice.setMute(false, reason)
					}else{
						await member.voice.setMute(true, reason)
					}
				}
			}
			msg.channel.send("Muted (or unmuted) everyone in your voice channel!")
		}else{
			if(!member.voice.channel) return msg.channel.send(`${member.user.tag} is not in a voice channel!`)
			if(member.voice.serverMute == true){
				args.shift()
				const reason = args.length ? args.join(" ") : "None" 
				await member.voice.setMute(false, reason)
				msg.channel.send("Unmuted them!")
			}else{
				args.shift()
				const reason = args.length ? args.join(" ") : "None" 
				await member.voice.setMute(true, reason)
				msg.channel.send("Muted them!")
			}
		}
	}
}