const fs = require('fs')
const {MessageEmbed} = require('discord.js')
module.exports= {
	async update(client, log){
		let callBack = (e) => {if(e) {log('warn', e)}}
		let reminders1 = fs.readFileSync('./storage/reminders.json', {encoding: 'utf-8', flag: 'r'})
		let reminders = JSON.parse(reminders1)
		for(const reminder of reminders){
			if(Date.now() >= reminder.end){
				const guild = client.guilds.cache.get(reminder.guild)
				if(!guild){
					reminders = reminders.splice(reminders.indexOf(reminder), reminders.indexOf(reminder))
					fs.writeFile('./storage/reminders.json', JSON.stringify(reminders, null, 2), callBack)
					continue
				}
				const channel = guild.channels.cache.get(reminder.channel)
				if(!channel){
					reminders = reminders.splice(reminders.indexOf(reminder), reminders.indexOf(reminder))
					fs.writeFile('./storage/reminders.json', JSON.stringify(reminders, null, 2), callBack)
					continue
				}
				channel.send(`<@${reminder.author}>, ${reminder.message}`)
				log('reminders', `Reminder ended, Message: ${reminder.message}`)
				reminders = reminders.splice(reminders.indexOf(reminder), reminders.indexOf(reminder))
				fs.writeFile('./storage/reminders.json', JSON.stringify(reminders, null, 2), callBack)
			}
		}
	}
}