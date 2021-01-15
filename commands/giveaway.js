const {MessageEmbed} = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const chalk = require('chalk')
const awaitMessages = require('../awaitMessages')
module.exports ={
	name: 'giveaway-start',
	format: 'giveaway-start',
	description: 'Gives something away',
	permissions: ['MANAGE_GUILD'],
	myPermissions: [],
	category: 'Fun',
	aliases: ['giveaway'],
	args: false,
	async run(msg, args, client){
		msg.channel.send("What prize do you want?")
		let prize = await awaitMessages(msg.channel, (m) => m.author.id == msg.author.id, 120000, "You took to long too respond, command cancelled!")
		if(!prize) return
		msg.channel.send("How long do you want the giveaway to be?")
		let time1 = await awaitMessages(msg.channel, (m) => m.author.id == msg.author.id, 120000, "You took to long too respond, command cancelled!")
		if(!time1) return
		const time = ms(time1.first().content)
		if(!time) return msg.channel.send(`**${time1.first().content}** isn't a recognized time format!`)
		msg.channel.send("What channel do you want it to be in?")
		let channelContent = await awaitMessages(msg.channel, (m) => m.author.id == msg.author.id, 120000, "You took to long top respond, command cancelled!")
		if(!channelContent) return
		channelContent = channelContent.first()
		const channel = channelContent.mentions.channels.first() || msg.guild.channels.get(channels.content) || msg.guild.channels.find(c => c.name.toLowerCase() == channels.content.toLowerCase())
		if(!channel) return msg.channel.send("You didn't include a channel!")
		msg.channel.send("How many winners?")
		let winners = await awaitMessages(msg.channel, (m) => m.author.id == msg.author.id, 120000, "You took too long to respond, command cancelled!")
		if(isNaN(winners.first().content)) return msg.channel.send("The amount of winners should be a number!")
		msg.channel.send("Send the role for the requirements (You don't need to ping the role, just send the ID) or type \"none\" for no requirements")
		let reqMsg = await awaitMessages(msg.channel, (m) => m.author.id == msg.author.id, 120000, "You took too long to respond, command cancelled!")
		let req;
		if(reqMsg.first().content.toLowerCase() == 'none'){
			req = null;
		}else{
			req = reqMsg.first().mentions.roles.first() || msg.guild.roles.cache.get(reqMsg.first().content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() == reqMsg.first().content.toLowerCase())
			if(!req) return msg.channel.send("That wasn't a role mention, id, or name in the given message")
		}

		let roundTowardsZero = async (time) =>{
			if(time > 0){
				return Math.floor(time)
			}else{
				return Math.ceil(time)
			}
		}
		let days = await roundTowardsZero(time / 86400000),
			hours = await roundTowardsZero(time / 3600000) % 24,
			minutes = await roundTowardsZero(time / 60000) % 60,
			seconds = await roundTowardsZero(time / 1000) % 60;
		if (seconds === 0) seconds++;
		let isDay = days > 0,
			isHour = hours > 0,
			isMinute = minutes > 0;
		let finalTimeRemaining = 
			(!isDay ? '' : `${days} day(s)`) + " " +
			(!isHour ? '' : `${hours} hour(s)`) + " " +
			(!isMinute ? '' : `${minutes} minutes(s)`) + " " +
			`${seconds} second(s)`
		const giveawayEmbed = new MessageEmbed()
			.setTitle(prize.first().content)
			.setDescription(`React with 🎉 to enter!\nTime remaining: **${finalTimeRemaining}**\nHosted by: <@${msg.author.id}>\nRole requirements: ${req ? `<@&${req.id}>` : "None"}`)
			.setFooter(`${winners.first().content} winner(s)`)
			.setTimestamp(Date.now() + time)
			.setColor('RED')
		const giveawayMessage = await channel.send(giveawayEmbed)
		giveawayMessage.react('🎉')

		const giveawayInfo = {
			messageID: giveawayMessage.id,
			channelID: giveawayMessage.channel.id,
			guildID: giveawayMessage.guild.id,
			startAt: Date.now(),
			endAt: Date.now() + time,
			winnerCount: winners.first().content,
			prize: prize.first().content,
			requirements: req,
			hostedBy: msg.author.id
		}
		client.log('giveaway', `Giveaway started, Message ID: ${giveawayMessage.id}`)
		let currentGiveaways = JSON.parse(fs.readFileSync(`${__dirname}/../storage/giveaway.json`, {encoding: 'utf-8', flag: 'r'}))
		currentGiveaways.push(giveawayInfo)
		fs.writeFile(`${__dirname}/../storage/giveaway.json`, JSON.stringify(currentGiveaways, null, 2), deleteFileCallback)
    function deleteFileCallback(error) {
      if (error) {
        client.log(`warn`, `Did not find the file`)
      }
    }
	}
}