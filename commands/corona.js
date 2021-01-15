const covid = require('novelcovid')
covid.settings({
	baseUrl: 'https://disease.sh'
})
const quickChart = require('quickchart-js')
const fs = require('fs')
const {MessageEmbed} = require('discord.js')
const moment = require('moment')
function getDates(startDate) {
	nowNormalized = moment().startOf("month"),
	startDateNormalized = startDate.clone().startOf("month").add(1, "M"),
	months = [];
	while (startDateNormalized.isBefore(nowNormalized)) {
		months.push(startDateNormalized.format("MMM YYYY"));
		startDateNormalized.add(1, "M");
	}
	months.push(moment().format('MMM YYYY'))
	return months;
}
module.exports={
	name: 'corona',
	aliases: ['covid', 'covid19', 'coronavirus'],
	format: 'corona [area]',
	args: false,
	descripiton: "Gets the Covid-19 statistics for the included country or globally.",
	permissions: [],
	category: 'Info',
	myPermissions: [],
	async run(msg, args, client){
		if(!args[0]){
			let data = await covid.all()
			const confirmed = data.cases.toLocaleString()
			const todayconfirmed=data.todayCases.toLocaleString()
			const deaths = data.deaths.toLocaleString()
			const todaydeaths=data.todayDeaths.toLocaleString()
			const recovered = data.recovered.toLocaleString()
			const critical = data.critical.toLocaleString()
			const active = data.active.toLocaleString()
			const embed = new MessageEmbed()
				.setColor('RED')
				.setTimestamp(data.updated)
				.setFooter("Updated at")
				.setAuthor("Coronavirus Statistics")
				.addField(`Data for: Worldwide`, `Confirmed: (Total: **${confirmed}** | Daily: **${todayconfirmed}**) \nDeaths: (Total: **${deaths}** | Daily: **${todaydeaths}**) \nRecovered: **${recovered}** \nCritical: **${critical}** \nActive: **${active}**\nAffected countries: **${data.affectedCountries}**\n`)
			//graph
			const historical = await covid.historical.all({days: -1})
			let months = getDates(moment('12-23-2019', 'MM-DD-YYYY'))
			let historicalCases = []
			let historicalDeaths = []
			let histroicalRecovered = []
			for(const [month, cases] of Object.entries(historical.cases)){
				const time = Object.keys(historical.cases).find((key) => historical.cases[key] === cases)
				const timeSplit = time.split("/")
					let month=timeSplit[0];
					if(timeSplit[2] >= '2021'){
						for(i=0;i<(timeSplit[2]-2020);i++){
							month+=13
						}
					}
				if(!historicalCases[month-1]){
					historicalCases.push(cases)
				}else{
					historicalCases[month-1]+=cases
				}
			}
			for(const [month, cases] of Object.entries(historical.deaths)){
				const time = Object.keys(historical.deaths).find((key) => historical.deaths[key] === cases)
				const timeSplit = time.split("/")
				let month=timeSplit[0];
				if(timeSplit[2] >= '2021'){
					for(i=0;i<(timeSplit[2]-2020);i++){
						month+=13
					}
				}
				if(!historicalDeaths[month-1]){
					historicalDeaths.push(cases)
				}else{
					historicalDeaths[month-1]+=cases
				}
			}
			for(const [month, cases] of Object.entries(historical.recovered)){
				const time = Object.keys(historical.recovered).find((key) => historical.recovered[key] === cases)
					const timeSplit = time.split("/")
					let month=timeSplit[0];
					if(timeSplit[2] >= '2021'){
						for(i=0;i<(timeSplit[2]-2020);i++){
							month+=13
						}
					}
				if(!histroicalRecovered[month-1]){
					histroicalRecovered.push(cases)
				}else{
					histroicalRecovered[month-1]+=cases
				}
			}
			const options={
				type: "line",
				data: {
					labels: months,
					datasets:[{
						label: 'Cases',
						data: historicalCases,
						fill: false
					}, {
						label: 'Deaths',
						data: historicalDeaths,
						fill: false,
					}, {
						label: 'Recovered',
						data: histroicalRecovered,
						fill: false
					}]
				}
			}
			const covidChart = new quickChart().setConfig(options).setBackgroundColor('white');
			embed.setImage(await covidChart.getShortUrl())
			msg.channel.send(embed)

		}	else{

			let cases = await covid.countries({country: args.join(" "), allowNull: true})
			if(cases.message) cases = await covid.continents({continent: args.join(" "), allowNull: true})
			if(cases.message) cases= await covid.states({state: args.join(" "), allowNull: true})
			if(cases.message) return msg.channel.send(`You need to include a valid location!`)
			const country = cases.country || cases.continent || cases.state
			const flag = cases.countryInfo?cases.countryInfo.flag:null
			const updated = cases.updated
			const confirmed = cases.cases.toLocaleString()
			const todayconfirmed = cases.todayCases.toLocaleString()
			const deaths =cases.deaths.toLocaleString()
			const todaydeaths = cases.todayDeaths.toLocaleString()
			const recovered = cases.recovered.toLocaleString()
			const critical = cases.critical ? cases.critical.toLocaleString():"No information provided"
			const active = cases.active.toLocaleString()
			const embed = new MessageEmbed()
				.setColor('RED')
				.setTimestamp(updated)
				.setFooter("Updated at")
				.setAuthor("Coronavirus Statistics", flag)
				.addField(`Data for: ${country}`, `Confirmed: (Total: **${confirmed}** | Daily: **${todayconfirmed}**) \nDeaths: (Total: **${deaths}** | Daily: **${todaydeaths}**) \nRecovered: **${recovered}** \nCritical: **${critical}** \nActive: **${active}**`)
			//graph
			msg.channel.send(embed)
		}	
	}
}