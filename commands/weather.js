const {MessageEmbed} = require('discord.js')
const weather = require('weather-js')
const CarouselEmbed = require('../carouselEmbed')
const momentz = require('moment-timezone')
module.exports={
	name: 'weather',
	aliases: [],
	format: 'weather <c|f> <location>',
	description: 'Gets the weater of a location',
	permissions:[],
	myPermissions: [],
	category: 'Info',
	args: true,
	async run(msg, args, client){
		let degreeType="";
		if(args[0].toLowerCase() == 'farenheit' || args[0].toLowerCase() == 'f'){
			degreeType='f'
		}else if(args[0].toLowerCase() == 'celsius'||args[0].toLowerCase() == 'c'){
			degreeType='c'
		}else return msg.channel.send("Please include a valid degree type!")
		args.shift()
  	weather.find({search: args.join(" "), degreeType: degreeType}, function (error, result){
			if(error) return msg.channel.send(`There was an error! (Are you sure **${args.join(" ")}** is a location?`);

			if(result === undefined || result.length === 0) return msg.channel.send('**Invalid** location');

			let current = result[0].current;
			let location = result[0].location;
			let forecasts = result[0].forecast;
			let d = new Date();
			let myTimezone = "America/Toronto";
			let myDatetimeFormat= "YYYY-MM-DD";
			let time = momentz(d).tz(myTimezone).format(myDatetimeFormat);
			const weatherinfo = new MessageEmbed()
				.setDescription(`**${current.skytext}**`)
				.setAuthor(`Current weather forecast for ${current.observationpoint}`)
				.setThumbnail(current.imageUrl)
				.setColor('BLUE')
				.addField('Timezone', `UTC${location.timezone}`, true)
				.addField('Degree Type', degreeType, true)
				.addField('Temperature', `${current.temperature}°`, true)
				.addField('Wind', current.winddisplay, true)
				.addField('Feels like', `${current.feelslike}°`, true)
				.addField('Humidity', `${current.humidity}%`, true)
				.addField('Longitude', location.long)
				.addField('Latitude', location.lat, true)
			let startFrom = 0
			let embeds = []
			embeds.push(weatherinfo)
			for(const forecast of forecasts){
				if(forecast.date === time){
					startFrom = forecasts.indexOf(forecast)
					break;
				}
			}
			for(i=startFrom;i<forecasts.length;i++){
				const forecast = forecasts[i]
				let embed = new MessageEmbed()
					.setColor('BLUE')
					.setAuthor(`Weather forecast for ${current.observationpoint}`)
					.setDescription(forecast.skytextday)
					.addField(`Low`, forecast.low+"°", true)
					.addField('High', forecast.high+"°", true)
					.addField('Precipitation', forecast.precip.length ==0? "0" : forecast.precip + "%", true)
					.addField('Date', forecast.date + " " + forecast.day, true)
				embeds.push(embed)
			}
			const carouselEmbed = new CarouselEmbed(embeds, msg)
			carouselEmbed.startCarousel()
		})
	}
}