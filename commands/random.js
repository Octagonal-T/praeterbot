module.exports={
	name: 'random',
	aliases: [],
	args: true,
	format: 'random <min-max>',
	description: 'Gets a random number from your range',
	permissions: [],
	myPermissions: [],
	category: 'Other',
	async run(msg, args, client){
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
		const nums = args[0].split("-")
		if(!nums.length == 1)return msg.channel.send("You need to include a range!")
		if(isNaN(nums[0]) || isNaN(nums[1])) return msg.channel.send("Your range needs to be numbers!")
		msg.channel.send(getRandomInt(nums[0], nums[1]))
	}
}