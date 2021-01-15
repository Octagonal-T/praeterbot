module.exports={
	name: 'load',
	description: 'Loads (or reloads) a command',
	format:'load <file>',
	args: true,
	permissions: [],
	myPermissions: [],
	aliases: ['reload'],
	hideFromHelp: true,
	async run(msg, args, client){
		if(msg.author.id!=='717417879355654215') return;
		const commandName = args[0].toLowerCase();
		let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if(!command){
			try{
				command = require(`./${commandName}.js`)
			}catch (e){
				client.log('error',e)
				return msg.channel.send("Command file not found");
			}
			client.commands.set(command.name,command)
			msg.channel.send(`Loaded ${command.name}!`)
		}else{
			delete require.cache[require.resolve(`./${command.name}.js`)]
			try {
				const newCommand = require(`./${command.name}.js`);
				client.commands.set(newCommand.name, newCommand);
			} catch (error) {
				client.log('error',error);
				msg.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
				return;
			}
			msg.channel.send(`Command \`${command.name}\` was reloaded!`);
		}
	}
}