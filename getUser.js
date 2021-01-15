const {MessageEmbed} = require('discord.js')
module.exports={
	async getUser(guild, userToSearch, user, client){
		if(!userToSearch) return null;
		let userOrMember = await guild.members.cache.get(userToSearch) || await guild.members.cache.find(m => m.user.tag.toLowerCase() == userToSearch.toLowerCase()) || await guild.members.cache.find(m => m.user.username.toLowerCase() == userToSearch.toLowerCase()) || guild.member(client.users.cache.get(userToSearch)) || guild.members.cache.find(m => m.nickname? m.nickname.toLowerCase().trim()==userToSearch.toLowerCase().trim():false)
		if(!userOrMember) {
			return null
		}else if(user){
		 return userOrMember.user;
		}else{
			return userOrMember;
		}
	}
}