const fs = require('fs')
const{MessageEmbed} = require('discord.js')
module.exports={
	name: 'unwarn',
	format: 'unwarn <warn id>',
	args: true,
	descirpiton: 'Unwarns someone',
	permissions: ['MANAGE_MESSAGES'],
	myPermissions: [],
	category: 'Moderation',
	aliases: [],
	async run(msg, args, client){
		if(msg.guild.id !=714109821502095397 && msg.guild.id!=717859707230093414) return msg.channel.send("Sorry, but this command is for Praeternaturals only!")
		const res = fs.readFileSync(`${__dirname}/../storage/warnings.json`, {encoding: 'utf-8', flag: 'r'})
		let currentWarns = JSON.parse(res)
		const compare = () => {
			let flag  = false
			Object.keys(currentWarns).forEach((key) => {
				const warn = currentWarns[key]
				for(i=0;i<warn.length;i++){
					if(warn[i].id===args[0]){
						flag = true
					}
				}
			})
			return flag;
		}
		const compare2 = () => {
			let flag = false;
			Object.keys(currentWarns).forEach((key) => {
				const warn = currentWarns[key]
				for(i=0;i<warn.length;i++){
					if(warn[i].id===args[0]){
						const returnThing = {warn: warn[i], key: key}
						flag = returnThing;
					}
				}
			})
			return flag
		}
		if(!compare())return msg.channel.send("Invalid warn ID!")
		const {warn, key} = compare2()
		currentWarns[key]=currentWarns[key].splice(currentWarns[key].indexOf(warn),currentWarns[key].indexOf(warn))
		if(!currentWarns[key].length) delete currentWarns[key]
		msg.channel.send(`Rekoved a warn on **${msg.guild.members.cache.get(key) ? msg.guild.members.cache.get(key) : `<@${key}>`}**`)

		fs.writeFile(`${__dirname}/../storage/warnings.json`, JSON.stringify(currentWarns, null, 2), (e) => {if(e) client.log('warn', e)})
	}
}