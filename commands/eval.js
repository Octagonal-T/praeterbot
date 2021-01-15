const clean = (text) => {
  if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}
const {MessageEmbed, MessageAttachment, Collector, Collection, Invite} = require('discord.js')
const Discord = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const moment = require('moment')
const fetch = require('node-fetch')
module.exports={
	name: 'eval',
	format: 'eval <code>',
	description: 'Evals some code (Oct only)',
	aliases: [],
	category: 'Other',
	permissions: ['ADMINISTRATOR'],
	myPermissions: [],
	args: true,
	hideFromHelp: true,
	async run(msg, args, client){
		if (msg.author.id !== `717417879355654215`) return msg.channel.send("You aren't my owner!")
    try {
      let evaled = eval(args.join(" "));
      if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);
      msg.channel.send(clean(evaled), {code:"xl",split:{char:'\n'}})	.catch((e) => {
				msg.channel.send("There was an error in sending the message, here's the error: ```xl\n"+e+"```").catch((f) => {
					msg.author.send("There was an error sending the error message, here's the error thrown when sending the error message: ```xl\n"+f+"```\n Here's the error message when sending the eval message: ```xl"+e+"```")
				})
			});
    }
    catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
	}
}