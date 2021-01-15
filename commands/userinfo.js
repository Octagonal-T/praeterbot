const {MessageEmbed} = require('discord.js')
const {getUser} = require('../getUser')
const moment = require('moment')
const CarouselEmbed = require('../carouselEmbed')
module.exports = {
	name: "userinfo",
	aliases: ['info'],
	format: 'userinfo [@user]',
	description: 'The user info of a user',
	permissions: [],
	myPermissions: [],
	category: 'Info',
	args: false,
	async run(msg, args, client){
		let user;
		if(args.length){
			user = msg.mentions.users.first() || await getUser(msg.guild, args[0], true, client) || msg.author
		}else{
			user = msg.author
		}
		let member = msg.guild.member(user)
    const created = moment(user.createdAt).format('MM/DD/YYYY h:mm:ss a');
    const joined = moment(member.joinedAt).format(`MM/DD/YYYY h:mm:ss a`);
		const avatar = user.displayAvatarURL({dynamic: true})
		const bot = user.bot
		const id = user.id
		const status = user.presence.status
		const nickname = member.nickname ? member.nickname : `None`
		//role
		let role = member._roles
		for(i=0;i<role.length;i++){
			role[i] = {
				position: await msg.guild.roles.cache.get(role[i]).position,
				role: role[i]
			}
		}
		const compareRolePositions = async (a, b) => {
			return a.position-b.position
		}
		let roles = role.sort(compareRolePositions)
		let rolee = ""
		for(const rol of roles){
			rolee += ` <@&${rol.role}> `
		}
		roles = rolee ? rolee : "none"
    let activities = user.presence.activities
		let activityEmbeds =[]
		for(const activity of activities){
			const activityEmbed = new MessageEmbed()
				.setTitle("Activity **" + user.tag + "**")
				.addField("Avatar", `[Click to Download](${avatar} "Click to download ${user.tag}'s avatar!")`)
				.setThumbnail(avatar)
				.setColor('RED')
				.addField("Name", activity.name, true)
				.addField("Type", activity.type, true)
				.addField("URL", activity.url?activity.url:"None", true)
				.addField("State", activity.state?activity.state:"None", true)
				.addField("Details", activity.details?activity.details:"None", true)
			activityEmbeds.push(activityEmbed)
		}
		let embeds = []
		const userEmbed = new MessageEmbed()
			.setTitle("User Specific **" + user.tag + "**")
			.addField("Avatar", `[Click to Download](${avatar} "Click to download ${user.tag}'s avatar!")`)
			.addField("Created At", created, true)
			.addField("ID", id, true)
			.addField("Bot", bot, true)
			.addField("Status", status, true)
			.setThumbnail(avatar)
			.setColor("RED")
		const memberEmbed = new MessageEmbed()
			.setTitle("Server Specific **" + user.tag + "**")
			.addField("Joined At", joined, true)
			.addField("Nickname", nickname, true)
			.setColor("RED")
		const roleEmbed = new MessageEmbed()
			.setTitle("Roles **" + user.tag + "**")
			.setDescription(roles)
			.setColor("RED")
		embeds.push(userEmbed)
		embeds.push(memberEmbed)
		embeds.push(roleEmbed)
		embeds = embeds.concat(activityEmbeds)
		const carouselEmbed = new CarouselEmbed(embeds, msg)
		carouselEmbed.startCarousel()

	}
}