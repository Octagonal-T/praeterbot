const {MessageEmbed, MessageAttachment} = require('discord.js')
const CarouselEmbed = require('../carouselEmbed')
const moment = require('moment')
const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};
module.exports={
	name: 'serverinfo',
	aliases: ['guildinfo'],
	format: 'serverinfo',
	args: false,
	permissions: [],
	myPermissions: [],
	category: 'Info',
	description: "Info the the current server you're in",
	async run(msg, args, client){
		const roles = msg.guild.roles.cache.sort((a, b) => a.position - b.position).map(r => r.toString())
		const channels = msg.guild.channels.cache
		const emojis = msg.guild.emojis.cache
		const members = msg.guild.members.cache
		const icon = msg.guild.iconURL({dynamic: true})
		
		const generalEmbed = new MessageEmbed()
			.setTitle("Server Info " + msg.guild.name)
			.addField("Icon", `[Click here to download!](${icon} "Click here to download ${msg.guild.name}'s icon!")`, false)
			.addField('General', [
				`**Name:** ${msg.guild.name}`,
				`**ID:** ${msg.guild.id}`,
				`**Owner:** ${msg.guild.owner.user.tag} (${msg.guild.ownerID})`,
				`**Region:** ${regions[msg.guild.region]}`,
				`**Boost Tier:** ${msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None'}`,
				`**Explicit Filter:** ${filterLevels[msg.guild.explicitContentFilter]}`,
				`**Verification Level:** ${verificationLevels[msg.guild.verificationLevel]}`,
				`**Time Created:** ${moment(msg.guild.createdTimestamp).format('LT')} ${moment(msg.guild.createdTimestamp).format('LL')} ${moment(msg.guild.createdTimestamp).fromNow()}`,
				'\u200b'
			])
			.setThumbnail(icon)
			.setColor("BLUE")

		const statisticsEmbed = new MessageEmbed()
			.setTitle(`Server Info ${msg.guild.name}`)
			.setThumbnail(icon)
			.setColor("BLUE")
			.addField("Icon", `[Click here to download!](${icon} "Click here to download ${msg.guild.name}'s icon!")`, false)
			.addField('Statistics', [
				`**Role Count:** ${roles.length}`,
				`**Emoji Count:** ${emojis.size}`,
				`**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
				`**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
				`**Member Count:** ${msg.guild.memberCount}`,
				`**Humans:** ${members.filter(member => !member.user.bot).size}`,
				`**Bots:** ${members.filter(member => member.user.bot).size}`,
				`**Text Channels:** ${channels.filter(channel => channel.isText()).size}`,
				`**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
				`**Boost Count:** ${msg.guild.premiumSubscriptionCount || '0'}`,
				'\u200b'
			])

		const precenseEmbed = new MessageEmbed()
			.setTitle(`Server info ${msg.guild.name}`)
			.addField("Icon", `[Click here to download!](${icon} "Click here to download ${msg.guild.name}'s icon!")`, false)
			.setThumbnail(icon)
			.setColor("BLUE")
			.addField('Presence', [
				`**Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`**Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`**Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
				`**Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
				'\u200b'
			])
    let Emojis = "";
    let EmojisAnimated = "";
    function Emoji(id) {
      return client.emojis.cache.get(id).toString();
    }
		emojis.forEach((emoji) => {
      if (emoji.animated) {
        EmojisAnimated += Emoji(emoji.id);
      } else {
        Emojis += Emoji(emoji.id);
      }
    });
		const ageEMbed = new MessageEmbed()
			.setTitle(`Server info ${msg.guild.name}`)
			.addField("Icon", `[Click here to download!](${icon} "Click here to download ${msg.guild.name}'s icon!")`, false)
			.setThumbnail(icon)
			.setColor("BLUE")
			.addField('Ages', [
				`**Oldest:**, ${msg.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => a.user.createdAt - b.user.createdAt).first().user.tag}`,
				`**Youngest:**, ${msg.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => b.user.createdAt - a.user.createdAt).first().user.tag}`
			])
		const serverinfoEmbedCarousel = new CarouselEmbed([generalEmbed, statisticsEmbed, precenseEmbed, ageEMbed], msg)
		serverinfoEmbedCarousel.startCarousel()
	}
}