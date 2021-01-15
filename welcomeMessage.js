const Canvas = require('canvas');
const {MessageEmbed,MessageAttachment} = require('discord.js')
module.exports={
	async welcome(member,client){
		if(member.guild.id==714109821502095397){
			let timeStamp= Date.now() - member.user.createdTimestamp
			if (timeStamp<=86400000&&!member.user.bot) {
				let flag = false;
				await member.send(`Sorry, your account is under a day old, come back later! If this is glitching and your account is actually over a day old, dm !Octaongal T #6969`).catch((e)=>{client.log('warn','e');flag=true})
				await member.kick()
				const ch = member.guild.channels.cache.find(channel => channel.name === "member-join-logs");
				const kickedEmbed = new MessageEmbed()
					.setColor(`RED`)
					.setTitle(`Raid protection`)
					.setDescription(`Kicked someone because their account was under a day old\n Member: ${member}, Account time stamp: ${timeStamp}, Tag: ${member.user.tag}\n\nCould ${flag?"not":""} DM them`)
					.setFooter(`Praeterbot`);
				ch.send("<@717417879355654215>",kickedEmbed);
				return;
			}

			const ch = member.guild.channels.cache.get('714118224869851177')
			const canvas = Canvas.createCanvas(711, 305);
			const ctx = canvas.getContext('2d');
			const background = await Canvas.loadImage('./assets/wallpaper.jpg');
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = '#74037b';

			ctx.strokeRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.arc(156, 154, 124, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
			ctx.drawImage(avatar, 30, 20, 254, 254);
			let members = member.guild.members.cache.map(u => u.user.id)
			let bots = 0;
			for(i=0;i<members.length;i++){
				let user = client.users.cache.get(members[i])
				if(user.bot === true){
					bots++
				}
			}
			let users = member.guild.memberCount - bots
			const memberChannel = member.guild.channels.cache.get(`796443358842847264`)
			memberChannel.setName(`All Members: ${member.guild.memberCount}`)
			const userChannel = member.guild.channels.cache.get(`714890653770842143`)
			userChannel.setName(`Users: ${users}`)
			const botChannel = member.guild.channels.cache.get(`714890656987873311`)
			botChannel.setName(`Bots: ${bots}`)
			const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
			ch.send (`Welcome to Praeternaturals, **${member}** ! First and foremost, read <#714109821502095400> in its entirety. Afterwards, head over to <#714876943828385853> for more guides on how to get started. We hope you enjoy your stay here!`, attachment); 
			setTimeout(()=>{ 
				ch.send(`Welcome!`)
			}, 3000);
		}else if(member.guild.id=='717859707230093414'){
			member.guild.channels.cache.get('741278614582067231').send(`uhhh welcome and everything ${member}`)
		}
	},
	async leave(member, client){
		if (member.guild.id == 714109821502095397) {
			let timeStamp =  Date.now() - member.user.createdTimestamp
			if (timeStamp <= 86400000) {
				return;
			}
			let members = member.guild.members.cache.map(u => u.user.id)
			let bots = 0;
			for(i=0;i<members.length;i++){
				let user = client.users.cache.get(members[i])
				if(user.bot === true){
					bots++
				}
			}
			let users = member.guild.memberCount - bots
			const memberChannel = member.guild.channels.cache.get(`796443358842847264`)
			memberChannel.setName(`All Members: ${member.guild.memberCount}`)
			const userChannel = member.guild.channels.cache.get(`714890653770842143`)
			userChannel.setName(`Users: ${users}`)
			const botChannel = member.guild.channels.cache.get(`714890656987873311`)
			botChannel.setName(`Bots: ${bots}`)
			member.guild.channels.cache.get('714118224869851177').send(`**${member.user.tag}** just rode off into the sunset. (<@${member.id}>)`);
		}else if(member.guild.id==717859707230093414){
			member.guild.channels.cache.get('741278614582067231').send(`okay bye ${member}`)
		}
	}
}
