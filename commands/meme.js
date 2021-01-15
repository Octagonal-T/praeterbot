const {MessageEmbed} = require('discord.js')
const fetch = require('node-fetch')
module.exports={
	name: 'meme',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: false,
	category: 'Fun',
	format: 'meme',
	description: "Gets a meme from a subreddit",
	async run(msg, args, client){
		for(flag=true;flag;){
			const res = await fetch('https://www.reddit.com/r/memes/random/.json')
			res.json().then(async (content) => {
				let permalink = content[0].data.children[0].data.permalink;
				let memeUrl = `https://reddit.com${permalink}`;
				let memeImage = content[0].data.children[0].data.url;
				let memeTitle = content[0].data.children[0].data.title;
				let memeUpvotes = content[0].data.children[0].data.ups;
				let memeNumComments = content[0].data.children[0].data.num_comments;
				if(memeUpvotes>20000){
					flag=false;
					let memeEmbed = new MessageEmbed()
						.setTitle(`${memeTitle}`)
						.setURL(`${memeUrl}`)
						.setImage(memeImage)
						.setColor('RANDOM')
						.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`)
					await msg.channel.send(memeEmbed);
				}else{
					flag=true;
				}
			}).catch((e) => {
				client.log('warn', e)		
			})
		}
	}
}