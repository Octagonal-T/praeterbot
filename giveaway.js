const fs = require('fs')
const {MessageEmbed} = require('discord.js')
module.exports = {
	async update(client, log){
		let giveaways1 = fs.readFileSync('./storage/giveaway.json', {encoding: 'utf-8', flag: 'r'})
		let giveaways = JSON.parse(giveaways1)
		for(const giveaway of giveaways){
			const guild = await client.guilds.cache.get(giveaway.guildID)
			if(!guild){
				giveaways = giveaways.splice(giveaways.indexOf(giveaway), giveaways.indexOf(giveaway))
				fs.writeFile('./storage/giveaway.json', JSON.stringify(giveaways, null, 2), deleteFileCallback)
				function deleteFileCallback(error) {
					if (error) {
						log(`warn`, `Did not find the file`)
					}
				}
			}else{
				const channel = await guild.channels.cache.get(giveaway.channelID)
				if(!channel){
					giveaways = giveaways.splice(giveaways.indexOf(giveaway), giveaways.indexOf(giveaway))
					fs.writeFile('./storage/giveaway.json', JSON.stringify(giveaways, null, 2), deleteFileCallback)
					function deleteFileCallback(error) {
						if (error) {
							log(`warn`, `Did not find the file`)
						}
					}
				}else{
					let message = await channel.messages.fetch(giveaway.messageID)
					if(!message){
						giveaways = giveaways.splice(giveaways.indexOf(giveaway), giveaways.indexOf(giveaway))
						fs.writeFile('./storage/giveaway.json', JSON.stringify(giveaways, null, 2), deleteFileCallback)
						function deleteFileCallback(error) {
							if (error) {
								log(`warn`, `Did not find the file`)
							}
						}
					}else{
						if(giveaway.endAt <= Date.now()){
							const reactorsNum = message.reactions.cache.get('🎉')
							let reactors = await reactorsNum.users.fetch()
							if((reactorsNum.count-1) <= (giveaway.winnerCount)){
								const notEnoughUsers = new MessageEmbed()
									.setTitle(giveaway.prize)
									.setDescription("Giveaway cancelled, not enough entries.")
									.setFooter("Ended at")
									.setTimestamp(giveaway.endAt)
								message.edit(notEnoughUsers)
								log(`GIVEAWAY`, `Giveaway ended, Not Enough Entries, Message ID: ${message.id}`)
								giveaways = giveaways.splice(giveaways.indexOf(giveaway), giveaways.indexOf(giveaway))
								fs.writeFile('./storage/giveaway.json', JSON.stringify(giveaways, null, 2), deleteFileCallback)
								function deleteFileCallback(error) {
									if (error) {
										log(`warn`, `Did not find the file`)
									}
								}
							}else{
								const winners = []
								for(i=0;i<giveaway.winnerCount;i++){
									let winner = Array.from(reactors.values())
									winner = winner[Math.floor(Math.random() * winner.length)]
									if(winners.indexOf(winner) != -1 || winner.bot){
										i--
									}else{
										winners.push(winner)
									}
								}
								const ggEmbed = new MessageEmbed()
									.setTitle(giveaway.prize)
									.setDescription(`Winner(s): ${winners.join(", ")}\nHosted by: <@${giveaway.hostedBy}>`)
									.setFooter(`${giveaway.winnerCount} winner(s),Ended at`)
									.setTimestamp(giveaway.endAt)
								message.edit(ggEmbed)
								log(`GIVEAWAY`, `Giveaway ended, Winners: ${winners.map((u) => u.tag)} Message ID: ${message.id}`)
								message.channel.send(`GG ${winners.join(", ")}, you won **${giveaway.prize}**!! <@${giveaway.hostedBy}> cough up mate.`, new MessageEmbed()
									.setTitle("GG!")
									.setDescription(`Giveaway over!\nWinners: ${winners.join(", ")}\nHosted by: <@${giveaway.hostedBy}>\n[Jump to Message](${message.url})`))
								giveaways = giveaways.splice(giveaways.indexOf(giveaway), giveaways.indexOf(giveaway))
								fs.writeFile('./storage/giveaway.json', JSON.stringify(giveaways, null, 2), deleteFileCallback)
								function deleteFileCallback(error) {
									if (error) {
										log(`warn`, `Did not find the file`)
									}
								}
							}
						}else{
							const remainingTime = giveaway.endAt - Date.now()
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
							const giveawayEmbed = new MessageEmbed()
								.setTitle(giveaway.prize)
								.setDescription(`React with 🎉 to enter!\nTime remaining: **${finalTimeRemaining}**\nHosted by: <@${giveaway.hostedBy}>\nRole requirements: ${giveaway.requirements ? `<@&${giveaway.requirements.id}>` : "None"}`)
								.setFooter(`${giveaway.winnerCount} winner(s)`)
								.setTimestamp(giveaway.endAt)
								.setColor('RED')
							message.edit(giveawayEmbed)
						}
					}
				}
			}
		}
	}
}	