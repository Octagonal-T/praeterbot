const {MessageEmbed} = require('discord.js')
const ms = require('ms')
const fs = require('fs')
module.exports={
	name: 'remindme',
	aliases: ['remind', 'reminder'],
	permissions: [],
	myPermissions: [],
	args: true,
	category: 'Other',
	description: "Sets a reminder for something",
	format: 'remindme <duration of time> <reminder message>',
	async run(msg, args, client){
		if(!args[1]) return msg.channel.send("You have to include the duration and the reminder message!")
		const time = ms(args[0])
		if(!time) return msg.channel.send(`**${args[0]}** isn't a recognized time format!`)
		args.shift()
		if(!msg.member.permissions.has('MENTION_EVERYONE')){
			if(msg.mentions.everyone) return msg.channel.send("You can't ping everyone with this command!")
		}
		const reminderInfo = {
			start: Date.now(),
			end: Date.now() + time,
			channel: msg.channel.id,
			message: args.join(" "),
			author: msg.author.id,
			guild: msg.guild.id
		}
		let currentReminders = JSON.parse(fs.readFileSync(`${__dirname}/../storage/reminders.json`, {encoding: 'utf-8', flag: 'r'}))
		currentReminders.push(reminderInfo)
		fs.writeFile(`${__dirname}/../storage/reminders.json`, JSON.stringify(currentReminders, null, 2), deleteFileCallback)
    function deleteFileCallback(error) {
      if (error) {
        cleint.log('warn', `Did not find the file`)
      }
    }
		msg.channel.send(`Reminder set for <#${msg.channel.id}> in ${ms(time)}`)
		client.log('reminders', `Reminder started, Time: ${ms(time)}, Message: ${args.join(" ")}, Author: ${msg.author.tag}`)
	}
}