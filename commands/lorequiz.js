const {MessageEmbed} = require('discord.js')
const compareArray = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  let set = {};
  a.forEach((i) => {
    if (set[i] !== undefined) {
      set[i]++;
    } else {
      set[i] = 1;
    }
  });
  let difference = b.every((i) => {
    if (set[i] === undefined) {
      return false;
    } else {
      set[i]--;
      if (set[i] === 0) {
        delete set[i];
      }
      return true;
    }
  });
  return Object.keys(set) == 0 && difference;
}
const questions=[
	{
		question: 'Praeternatural abilities are...',
		options: ['a) Hereditary (passed down from parent to child) and appear at any time after the age of 14', 'b) Randomly mutated and appear at any age', 'c) Randomly mutated and appear at any time after the age of 14'],
		correct: ['c'],
	},
	{
		question: 'For all praeternatural teens, attendance to the Paragon Institute is...',
		options: ['a) Mandatory', 'b) Optional'],
		correct: ['a']
	},
	{
		question: 'The three high roles (HRs) of the Paragon that can be applied for are...',
		options: ['a) Instructors', 'b) Secretaries', 'c) Groundskeepers', 'd) Tutors', 'e) Headmaster', 'f) Janitors'],
		correct: ['a', 'd', 'e'],
	},
	{
		question: "The Paragon students' combat uniforms can be...",
		options: ['a) Fully customized, each student can wear whatever they want',"b) Given some accessories that enhance the student's own ability, but are all based off of a blue-and-black jumpsuit"],
		correct: ['b']
	},
	{
		question: 'The Optimists\' goal is to...',
		options: ['a) Abolish the Paragon and give Praeternaturals control over their lives','b) Keep the world safe from Praeternaturals and their abilities by removing all of them'],
		correct: ['a']
	},
	{
		question: 'The three High Roles (HRs) of the Optimists that can be applied for are...',
		options: ['a) General','b) Sergeant','c) Commander','d) Officer','e) Major','f) Lieutenant'],
		correct: ['c', 'd', 'f']
	},
	{
		question: 'Optimist, Townsfolk, and Paragon staff characters...',
		options: ['a) Don\'t need to have abilities, while Paragon students do','b) All must have abilities'],
		correct: ['a']
	},
	{
		question: 'To apply for an HR, you must...',
		options: ['a) Write a 1000+ word backstory','b) Add a RP sample as that character at the end of your form','c) Have a thorough understanding of Praeternaturals\'s lore','d) Be active and respectful OOC'],
		correct: ['b', 'c', 'd']
	},
	{
		question: 'The highest tier a 16 year old can have is...',
		options: ['a) Red','b) Blue','c) High Violet','d) Yellow','e) High Yellow'],
		correct: ['e'],
	},
	{
		question: 'For Paragon students, aliases are...',
		options: ['a) Mandatory', 'b) Optional'],
		correct: ['a']
	},
	{
		question: 'Which of the following abilities are banned?',
		options: ['a) Luck manipulation','b) Time travel','c) Morphing','d) Dimension hopping','e) "Alien" powers/being born in another universe','f) Temporarily turning people into puppets which they can control','g) Having a cat tail','h) all of the above'],
		correct: ['h']
	}
]
const order = ['First', 'Second', 'Third', `Fourth`, `Fifth`, `Sixth`, `Seventh`, `Eighth`, `Ninth`, `Tenth`, `Eleventh`]
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
module.exports={
	name:'lorequiz',
	aliases: ['charquiz', 'chartest', 'loretest', 'charlorecheck'],
	permissions: [],
	myPermissions: [],
	args: false,
	category: 'Other',
	format: 'lorequiz',
	description: 'Gives you the quiz on the lore so you can submit a character',
	async run(msg, args, client){
		if(msg.guild.id !== '714109821502095397' && msg.guild.id !== '717859707230093414') return msg.channel.send("This command is for Praeternaturals only!")
		const channel = msg.guild.channels.cache.get('797508546992013322')
		if(msg.member.roles.cache.some(r => r.name === 'Char/Lore Checked!')) return msg.channel.send("You already have the role!")
		msg.author.send(new MessageEmbed().setTitle("Instructions").setDescription("You will have 2 minutes to complete each question. Read the questions thoroughly. If there are multiple answers, put the answers seperated by commas.\n\nRemember, if you are having trouble with the quiz, always feel free to ask staff for the answer by opening a ticket in <#735115072384532581>!")).then(() => {
			msg.channel.send('Sent the quiz to your DMs!')
			setTimeout( async ()=> {
				const wrongAnswers =[]
				for(i=0;i<questions.length;i++){
					const question = questions[i]
					const questionEmbed = new MessageEmbed()
						.setTitle(`${order[i]} question`)
						.setDescription(question.correct.length > 1 ? "Enter the letters of the **answers** seperated with commas into chat within 2 minutes! (enter all that apply to the question) Remember, there is more than one answer for this question!" : "Enter the letter of the answer into chat within 2 minutes!" + ` There are/is ${question.correct.length} answer(s) to this question!`)
						.addField(`**${question.question}**`, question.options.join("\n"))
						.setColor('RED')
					msg.author.send(questionEmbed)
					const filter = (m) => m.author.id == msg.author.id
					await msg.author.createDM()
					let message = await msg.author.dmChannel.awaitMessages(filter, {time: 120000, max: 1, errors: ['time']}).catch(()=>{
						msg.author.send("You need to respond with something! Try the command again, sorry!")
						if(channel){
							channel.send(`**${msg.author.tag}** didn't answer in time`)
						}
						return;
					})
					try{message.first.content}catch{return;}
					message = message.first().content
					let answered = message.split(",")
					for(b=0;b<answered.length;b++){
						answered[b]=answered[b].trim()
					}
					const validOptions = []
					for(b=0;b<question.options.length;b++){
						validOptions.push(alphabet[b])
					}
					for(b=0;b<answered.length;b++){
						if(validOptions.indexOf(answered[b]) == -1){
							if(channel){
								channel.send(`**${msg.author.tag}** didn't give a valid option`)
							}
							msg.author.send(`The options are only ${validOptions.join(", ")}`)
							return
						}
					}
					if(!compareArray(answered, question.correct)){
						wrongAnswers.push(`Question ${i+1}`)
					}
				}
				msg.author.send('Calculating score...')
				if(wrongAnswers.length){
					if(channel){
						channel.send(`**${msg.author.tag}** failed the lore quiz`)
					}
					let flunkedEmbed = new MessageEmbed()
						.setColor("RED")
						.setTitle("You did not pass, unfortunately!")
						.setDescription("Please review the character and lore channels and try again soon.")
						.addField("The questions you made mistakes on were", "*" + wrongAnswers.join(", ") + "* " + `\n**${wrongAnswers.length}/11 failed**`, true)
					setTimeout(()=> {
						msg.author.send(flunkedEmbed)
					}, 3000)
				}else{
					if(channel){
						channel.send(`**${msg.author.tag}** passed the lore quiz`)
					}
					let passedEmbed = new MessageEmbed()
						.setColor("GREEN")
						.setTitle("You've passed!")
						.addField("You now have the perms to submit a character!", "\u200b", true)
						.addField("Here's the character template!", "Click on [this link](https://docs.google.com/document/d/1FCXZumiXmM-ewnKCtiJP0CLP3Lbq2E10lZhx55eNl0s/edit) to be taken to the document! Please make a copy of this, and if you do not have a Google account, please DM a staff member.", true)
					setTimeout(()=>{
						msg.author.send(passedEmbed)
						const role = msg.guild.roles.cache.find(r => r.name ==='Char/Lore Checked!') || msg.guild.roles.cache.find(r => r.name.toLowerCase() == 'bot')
						msg.member.roles.add(role)
					}, 3000)
				}
			}, 5000)
		}).catch((e) => {
			msg.channel.send(`There was an error sending the DM! Here's the error: \`\`\`xl\n${e}\`\`\`\n Please open a ticket to get further support!`)
			return client.log('warn',e)
		})
	}
}