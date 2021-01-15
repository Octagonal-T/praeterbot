/*

MADE BY !OCTAGONAL T #6969

*/
require('./keepAlive');
const {Console} = require('console')
const fs = require('fs');
const ms = require('ms');
const welcomeMessage=require('./welcomeMessage');
const moment = require('moment')
const momentz = require('moment-timezone')
const chalk = require('chalk');
const {Client, MessageEmbed, Collection} = require('discord.js');
const { prefix, token, status, autoMod} = require('./config');
const client = new Client({
	partials: [`MESSAGE`, `USER`, `REACTION`, `CHANNEL`, `GUILD_MEMBER`, `GUILD_PRESENCES`],
	presence: {
    status: status.status,
    activity: {
      name: status.game,
      type: status.type
    }
	},
	ws: { properties: { $browser: "Discord iOS" } }
})
const outputStream = fs.createWriteStream('./log.log')
const logger = new Console({stdout:outputStream, stderr:outputStream})
const log = (level=null, string) => {
	let d = new Date();
	let myTimezone = "America/Toronto";
	let myDatetimeFormat= "YYYY-MM-DD hh:mm:ss A z";
	let time = momentz(d).tz(myTimezone).format(myDatetimeFormat);
	if(level.toLowerCase() == 'info'){
		console.log(`${chalk.green(`[INFO: ${time}]`)} - ${string}`)
		logger.log(`[INFO: ${time}] - ${string}`)
	}else if(level.toLowerCase() == 'error'){
		console.log(`${chalk.red(`[ERROR: ${time}]`)} - ${string}`)
		logger.log(`[ERROR: ${time}] - ${string}`)
	}else if(level.toLowerCase() == 'giveaway'){
		console.log(`${chalk.blue(`[GIVEAWAY: ${time}]`)} - ${string}`)
		logger.log(`[GIVEAWAY: ${time}] - ${string}`)
	}else if(level.toLowerCase() == 'warn'){
		console.log(`${chalk.yellow(`[WARN: ${time}]`)} - ${string}`)
		logger.log(`[WARN: ${time}] - ${string}`)
	}else if(level.toLowerCase() == 'automod'){
		console.log(`${chalk.red(`[AUTOMOD: ${time}]`)} - ${string}`)
		logger.log(`[AUTOMOD: ${time}] - ${string}`)
	}else if(level.toLowerCase() == 'reminders'){
		console.log(`${chalk.blueBright(`[REMINDERS: ${time}]`)} - ${string}`)
		logger.log(`[REMINDERS: ${time}] - ${string}`)
	}else{
		console.log(string)
		logger.log(`[ELSE: ${time}] - ${string}`)
	}
}
client.log = log
client.openTickets=new Set();
client.uptimeTime = Date.now()
const giveawayUpdate = require('./giveaway')
const reminderUpdate = require('./reminders')
const muteUpdate = require('./mute')
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
log(`info`, `Loaded all the command files!`)
client.on('ready', async ()=> {
	log(`info`,`Logged in as ${client.user.tag}`)
	setInterval(async () =>giveawayUpdate.update(client, log) , 10000)
	setInterval(async () =>reminderUpdate.update(client, log), 100)
	setInterval(async () =>muteUpdate.update(client), 100)
})
client.on('message', async msg => {
	if(!msg.guild) return;
	//automod
	if(autoMod.autoModToggle){
		if(autoMod.ignoreBots && msg.author.bot) return;
		if(autoMod.blackListWords){
			let includesWords = false;
			for(const word of autoMod.blackListedWords){
				if(msg.content.toLowerCase() == word.toLowerCase()) includesWords = true;
			}
			if(includesWords){
				await msg.delete();
				let warnMsg = await msg.reply("That word is banned!")
				log(`AUTOMOD`, `${msg.author.tag}`)
				setTimeout(() => {
					warnMsg.delete()
				}, 3000)
			}
		}
	}
	//commands
	if((msg.content.startsWith('https://discord.com/channels/')||msg.content.startsWith("https://discordapp.com/channels/")) && msg.guild.me.permissions.has('MANAGE_WEBHOOKS')){
		let [http, http2, discord, channels, guildID, channelID, messageID] = msg.content.split(" ")[0].split("/")
		let content = msg.content.split(" ")
		content.shift()
		content = content.join(" ")
		let guild = client.guilds.cache.get(guildID)
		if(!guild) return
		let channel = guild.channels.cache.get(channelID)
		if(!channel) return
		let message = await channel.messages.fetch(messageID)
		if(!message) return
		const messageEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(message.content)
			.addField('Source', `[Jump to message](${message.url})`)
			.setFooter(`${channel.name}`)
			.setTimestamp(message.createdTimestamp)
			.setColor("RED")
		if(message.attachments.first()){
			messageEmbed.setImage(message.attachments.first().proxyURL)
		}
		let webhooks = await msg.channel.fetchWebhooks()
		let webhook = webhooks.first()
		if(!webhook){
			webhook = await msg.channel.createWebhook(`${client.user.username} messageHooks`, {
				avatar: client.user.displayAvatarURL()
			})
		}
		let embeds = [messageEmbed]
		if(message.embeds.length){
			embeds.push(message.embeds[0])
		}
		webhook.send(content, {
			username: msg.member.displayName,
			avatarURL: msg.author.displayAvatarURL(),
			embeds: embeds
		})
		msg.delete()
	}
	if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();
  let currentTags = fs.readFileSync(`./storage/tags.json`, {encoding: 'utf-8'})
  currentTags=JSON.parse(currentTags);
  if(currentTags[msg.guild.id]){
    Object.keys(currentTags[msg.guild.id]).forEach((key) => {
      if(commandName===key.toLowerCase()){
        msg.channel.send(currentTags[msg.guild.id][key].text);
      }
    })
  }
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return

	if (command.args && !args.length) {
		return msg.channel.send(`You didn't provide any arguments, the format for this command is \`${command.format}\``)
	}
	for(const permission of command.permissions){
		if(!msg.member.permissions.has(permission)){
			const needsPermissionEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Invalid Permissions!")
				.setDescription("You don't have permission to do this!")
				.addField("Required permissions", command.permissions.join(", "))
			msg.channel.send(needsPermissionEmbed)
			return;
		}
	}
	for(const permission of command.myPermissions){
		if(!msg.guild.me.permissions.has(permission)){
			const needsPermissionEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Invalid Permissions!")
				.setDescription("I don't have permission to do this!")
				.addField("Required permissions", command.permissions.join(", "))
			msg.channel.send(needsPermissionEmbed)
			return;
		}
	}
	try{
		command.run(msg, args, client)
	}catch(e){
		client.log('warn', e)
		return;
	}
});
client.on('messageReactionAdd', async (reaction, user) => {
	if(reaction.partial) await reaction.fetch()
	if(reaction.message.partial) await reaction.message.fetch()
	if(user.partial) await user.fetch()

	if(user.bot) return
	const giveaways1 = fs.readFileSync(`./storage/giveaway.json`, {encoding: 'utf8', flag: 'r'})
	const giveaways = JSON.parse(giveaways1)
	for(const giveaway of giveaways){
		if(reaction.message.id == giveaway.messageID){
			if(giveaway.requirements){
				const role = reaction.message.guild.roles.cache.get(giveaway.requirements.id)
				if(!reaction.message.guild.member(user).roles.cache.some(r => r.id == role.id)){
					reaction.users.remove(user)
					user.send(new MessageEmbed()
						.setTitle("Entry denied")
						.setColor('RED')
						.setDescription(`You need the **${role.name}** role to enter this giveaway!`))
				}else{
					user.send(new MessageEmbed()
						.setTitle("Entry accepted!")
						.setColor("BLUE")
						.setDescription(`Your entry to [this giveaway](${reaction.message.url}) has been approved!`))
				}
			}else{
				user.send(new MessageEmbed()
					.setTitle("Entry accepted!")
					.setColor("BLUE")
					.setDescription(`Your entry to [this giveaway](${reaction.message.url}) has been approved!`))
			}
		}
	}
  if (reaction.message.id == '739828119049076886' && reaction.emoji.name == `🎫`) {
    reaction.users.remove(user);
		if(client.openTickets.has(user.id)) return user.send("Sorry, you already have a ticket open!");
    reaction.message.guild.channels.create(`ticket-${user.username}`, {
      type: 'text',
      parent: `754165665396686889`,
      topic: `${user.username}`,
      permissionOverwrites: [
        {
          id: user.id,
          allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        },
        {
          id: reaction.message.guild.roles.everyone,
          deny: ["VIEW_CHANNEL"],
        },
      	{
		      id: `714110759986266183`,
		      allow: ['VIEW_CHANNEL'],
      	},

      ],
    }).then(async channel => {
      channel.send(`@here`, new MessageEmbed()
      .setTitle(`Ticket`)
      .setDescription(`We will be with you shortly!\n Use \`p?close\` to close this ticket!\n Use \`p?add-ticket <@user||userid>\` to add someone to this ticket\nUse \`p?remove-ticket <@user||userid>\` to remove someone from this ticket`)
      .setColor(`#00ff00`) 
      )
			client.openTickets.add(user.id);
    })
  }
  if (reaction.emoji.name == '⭐'){
    let channel = reaction.message.guild.channels.cache.find(c => c.name.toLowerCase().endsWith('starboard'))
    let fetchedMessages = await channel.messages.fetch({limit: 100})
    let alreadyExisting;
    if (reaction.message.content){
      alreadyExisting  = fetchedMessages.find(m => {
				if(!m.embeds[0].footer) return false
				else if (m.embeds[0].footer.text.endsWith(reaction.message.id) && m.author.id == 721757120428638368) return true;
				else return false;
			})
    }else{
      alreadyExisting = fetchedMessages.find(m => {
				if(!m.embeds[0].footer) return false
				else if (m.embeds[0].footer.text.endsWith(reaction.message.id) && m.author.id == 721757120428638368) return true;
				else return false;
			});
    }
    if (alreadyExisting){
      let starEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
        .setDescription(reaction.message.content)
        .addField("Source", `[Jump to message!](${reaction.message.url})`)
        .setTimestamp(reaction.message.createdTimestamp)
				.setFooter(reaction.message.id)
      if (reaction.message.attachments.first()){
        starEmbed.setImage(reaction.message.attachments.first().proxyURL)
      }
      if(reaction.count >= 5){
        alreadyExisting.edit(`🌟 ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }else if(reaction.count == 0){
				alreadyExisting.delete()
			}
			else{
        alreadyExisting.edit(`⭐ ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }
    }else{
      let starEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
        .setDescription(reaction.message.content)
        .addField("Source", `[Jump to message!](${reaction.message.url})`)
        .setTimestamp(reaction.message.createdTimestamp)
				.setFooter(reaction.message.id)
      if (reaction.message.attachments.first()){
        starEmbed.setImage(reaction.message.attachments.first().proxyURL)
      }
      if(reaction.count >= 5){
        channel.send(`🌟 ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }else{
        channel.send(`⭐ ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }
    }
  }
});
client.on('messageReactionRemove', async (reaction, user)=> {
  if (user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
  if (user.bot) return;
  if (reaction.emoji.name == '⭐'&&reaction.message.guild.id=='714109821502095397'){
    let channel = reaction.message.guild.channels.cache.find(c => c.name.toLowerCase().endsWith('starboard'))
    let fetchedMessages = await channel.messages.fetch({limit: 100})
    let alreadyExisting;
    if (reaction.message.content){
      alreadyExisting  = fetchedMessages.find(m => {
			if(!m.embeds[0].footer) return false;
      else if (m.embeds[0].footer.text.endsWith(reaction.message.id) && m.author.id == 721757120428638368) return true;
      else return false;
    })
    }else{
      alreadyExisting = fetchedMessages.find(m => {
				if(!m.embeds[0].footer) return false
				else if(!m.embeds[0].footer) return false;
				else if (m.embeds[0].footer.text.endsWith(reaction.message.id) && m.author.id == 721757120428638368) return true;
				else return false;
    });
    }
    if (alreadyExisting){
      let starEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
        .setDescription(reaction.message.content)
        .addField("Source", `[Jump to message!](${reaction.message.url})`)
        .setTimestamp(reaction.message.createdTimestamp)
				.setFooter(reaction.message.id)
      if (reaction.message.attachments.first()){
        starEmbed.setImage(reaction.message.attachments.first().proxyURL)
      }
      if(reaction.count >= 5){
        alreadyExisting.edit(`🌟 ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }else if(reaction.count == 0){
				alreadyExisting.delete()
			}
			else{
        alreadyExisting.edit(`⭐ ${reaction.count} <#${reaction.message.channel.id}>`, starEmbed)
      }
    }
  }
})
client.on('guildMemberAdd',async (member) => {
	welcomeMessage.welcome(member,client);
});
client.on('guildMemberRemove',async (member) => {
	welcomeMessage.leave(member,client);
});
client.on('warn', m => log('warn', m));
client.on('error', m => log('error', m));

process.on('uncaughtException', error => log('error', error));
client.login(token)