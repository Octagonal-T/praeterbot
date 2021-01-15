const {MessageEmbed, Collection} = require('discord.js')
const fs = require('fs')
module.exports={
	name: 'reminders',
	aliases: ['view-reminders'],
	description: 'View the reminders in the server',
	format: 'reminders',
	args: false,
	permissions: [],
	category: 'Other',
	myPermissions: [],
	async run(msg, args, client){
		let currentReminders = JSON.parse(fs.readFileSync(`${__dirname}/../storage/reminders.json`, {encoding: 'utf-8', flag: 'r'}))
		let guildReminders= []
		for(const reminder of currentReminders){
			if(reminder.guild == msg.guild.id){
				const remainingTime = reminder.end - Date.now()
				let roundTowardsZero = async (remainingTime) =>{
					if(remainingTime > 0){
						return Math.floor(remainingTime)
					}else{
						return Math.ceil(remainingTime)
					}
				}
				let days = await roundTowardsZero(remainingTime / 86400000),
					hours = await roundTowardsZero(remainingTime / 3600000) % 24,
					minutes = await roundTowardsZero(remainingTime / 60000) % 60,
					seconds = await roundTowardsZero(remainingTime / 1000) % 60;
				if (seconds === 0) seconds++;
				let isDay = days > 0,
					isHour = hours > 0,
					isMinute = minutes > 0;
				let finalTimeRemaining = 
					(!isDay ? '' : `${days} day(s)`) + " " +
					(!isHour ? '' : `${hours} hour(s)`) + " " +
					(!isMinute ? '' : `${minutes} minutes(s)`) + " " +
					`${seconds} second(s)`
				guildReminders.push(`Remaining time: **${finalTimeRemaining}**\nPerson: **${msg.guild.members.cache.get(reminder.author).user.tag}**\nMessage:**${reminder.message}**`)
			}
		}
		const remindersEmbed = new MessageEmbed()
			.setTitle(`Reminders in ${msg.guild.name}`)
			.setDescription(guildReminders.join("\n\n"))
			.setColor("RED")
		msg.channel.send(remindersEmbed)
	}
}