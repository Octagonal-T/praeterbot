const {MessageAttachment,MessageEmbed} = require('discord.js')
module.exports={
	name: 'purgemembers',
	args: false,
	description: 'Purges inactive no characters that don\'t have the char/lore checked role or the partner role or the spectator role',
	format: 'purgemembers',
	permissions: ['ADMINISTRATOR'],
	myPermissions: ['KICK_MEMBERS'],
	aliases: [],
	hideFromHelp:true,
	async run(msg, args, client){
		if(msg.guild.id!='714109821502095397')return;
		let needsToBeKickedStage1 = msg.guild.members.cache.filter((m) => m.roles.cache.get('714128253060776089')&&(!m.roles.cache.get('757597736869560330')&&!m.roles.cache.get('720085305771950122')&&!m.roles.cache.get('714517696909410357')))
		const attachment = new MessageAttachment(Buffer.from(needsToBeKickedStage1.map(m=>m.user.tag).sort().join("\n"),'utf8'),'needsTobePurged.txt')
		const embed = new MessageEmbed().setTitle("Needs to be purged people").setDescription("Have the No Characters role\nDon't have the partners role\nDon't have the char/lore checked role\nHaven't spoken in 2 months").attachFiles(attachment).setColor("RED")
		msg.channel.send(embed)
	}
}