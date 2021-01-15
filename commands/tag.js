const fs = require('fs')
const {MessageEmbed}=require('discord.js')
module.exports={
	name: 'tag',
	aliases: ['tags'],
	permissions: ['MANAGE_MESSAGES'],
	myPermissions:[],
	args: true,
	format: 'tag create <name> <description>||tag delete <name>||tag edit <name> <description>',
	description: 'Makes, edits, or deletes a tag',
	async run(msg, args, client){
		let currentTags = fs.readFileSync(`${__dirname}/../storage/tags.json`, {encoding: 'utf-8'})
		currentTags=JSON.parse(currentTags);
		if(args[0].toLowerCase()=='all'){
			if(!currentTags[msg.guild.id]) return msg.channel.send("This server does not have any tags!")
			const guildTags = currentTags[msg.guild.id]
			const tagEmbed = new MessageEmbed()
			let description="";
			Object.keys(guildTags).forEach((k) => {
				description+=`**${k}** - ${guildTags[k].text}\n`
			})
			tagEmbed.setDescription(description).setColor("RED").setTitle("All the tags")
			msg.channel.send(tagEmbed)
			return
		}
    if(!args[1]) return msg.channel.send("You need to include more arguments!")
    if(args[0].toLowerCase()=='create'){
      if(!args[2]) return msg.channel.send("You need to include a text of the tag!")
      if(!currentTags[msg.guild.id]) currentTags[msg.guild.id]={}
      if(currentTags[msg.guild.id][args[1].toLowerCase()]){
        if(currentTags[msg.guild.id][args[1].toLowerCase()].guildID==msg.guild.id)return msg.channel.send("A tag with that name already exists! If you wanted to edit a tag, please do `"+prefix+"tag edit <name> <text>`")
      }
      let name = args[1]
      args.shift()
      args.shift()
      const text =args.join(" ") 
      currentTags[msg.guild.id][name.toLowerCase()]={guildID: msg.guild.id, text}
      msg.channel.send("Set the tag!")
    }else if(args[0].toLowerCase()=='delete'){
      if(!currentTags[msg.guild.id]) return msg.channel.send("Did not find a tag with that name!")
      if(!currentTags[msg.guild.id][args[1].toLowerCase()]) return msg.channel.send("Did not find a tag with that name!")
      delete currentTags[msg.guild.id][args[1].toLowerCase()]
      if(!Object.entries(currentTags[msg.guild.id]).length)delete currentTags[msg.guild.id]
      msg.channel.send(`Deleted the tag!`)
    }else if(args[0].toLowerCase()=='edit'){
      if(!args[2]) return msg.channel.send("You need to include the new text!")
      if(!currentTags[msg.guild.id]) return msg.channel.send("This server does not have any tags at all!")
      if(!currentTags[msg.guild.id][args[1].toLowerCase()]) return msg.channel.send("Did not find a tag with that name!")
      const name = args[1]
      args.shift()
      args.shift()
      const text =args.join(" ") 
      currentTags[msg.guild.id][name.toLowerCase()]={guildID: msg.guild.id, text}
      msg.channel.send("Edited the tag!");
    }else{
			msg.channel.send("Invalid format!")
		}
    fs.writeFile(`${__dirname}/../storage/tags.json`, JSON.stringify(currentTags, null, 2), (e) => {if(e) client.log('error',e)})
	}
}