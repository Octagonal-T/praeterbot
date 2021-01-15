module.exports = async (channel, filter, time, errorMessage) => {
	const message = await channel.awaitMessages(filter, {time: time, max: 1, errors: ['time']}).catch(()=>{
		channel.send(errorMessage)
		return null;
	})
	return message;
}