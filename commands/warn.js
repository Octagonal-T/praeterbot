const fs = require('fs')
const {getUser} = require('../getUser')
const {MessageEmbed} = require('discord.js')
const getRanString = (length) => {
	let result = '';
	let characters = 'abcdefghijklmnopqrstuvwxyz';
	let charactersLength = characters.length;
	for (i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
const compareIDs = (id, database) => {
	Object.keys(database).forEach((item) => {
		for(i=0;i<database[item].length;i++){
			if(database[item][i].id === id){
				return true;
			}
		}
		return false;
	})
}
module.exports={
	name: 'warn',
	description: 'Warns a user',
	format: 'warn <user> [reason]',
	args: true,
	aliases: [],
	permissions: ['MANAGE_MESSAGES'],
	myPermissions: [],
	category: 'Moderation',
	async run(msg, args, client){
		if(msg.guild.id !=714109821502095397 && msg.guild.id!=717859707230093414) return msg.channel.send("Sorry, but this command is for Praeternaturals only!")
		const callback = (e) => {
			if(e){
				client.log('warn', e)
			}
		}
		let currentWarns = fs.readFileSync(`${__dirname}/../storage/warnings.json`, {encoding: "utf-8"})
		currentWarns = JSON.parse(currentWarns)
		const user = await getUser(msg.guild, args[0], true, client) || msg.mentions.users.first()
		if(!user) return msg.channel.send("You need to include a valid member to warn!")
		args.shift()
		let id =""
		do{
			id = getRanString(5)
		}while(compareIDs(id, currentWarns))
		if(currentWarns[user.id]){
			currentWarns[user.id].push({
				moderator: msg.author.id,
				reason: args.length ? args.join(" ") : 'None',
				id: id
			})
		}else{
			currentWarns[user.id] = [
				{
					moderator: msg.author.id,
					reason: args.length ? args.join(" ") : 'None',
					id: id
				}
			]
		}
		msg.channel.send(`**${user.tag}** has been warned, this is their **${currentWarns[user.id].length}** warning. Warning reason: **${args.length ? args.join(" ") : "None"}**`)
		user.send(new MessageEmbed().setColor('RED').setTitle(`You have been warned in ${msg.guild.name}`).setDescription(`You have been warned in **${msg.guild.name}**\nReason: **${args.length ? args.join(" ") : "None"}**\nWarn ID: **${id}**`))
		fs.writeFile(`${__dirname}/../storage/warnings.json`, JSON.stringify(currentWarns, null, 2), callback)
	}
}	