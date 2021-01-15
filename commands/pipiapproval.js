const Canvas = require('canvas')
Canvas.registerFont(`${__dirname}/../assets/font.ttf`, { family: 'SourceSans' });
const {MessageAttachment} = require('discord.js')
module.exports={
	name: 'pipiapproval',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: true,
	format: 'pipiapproval <statement>',
	category: 'Fun',
	description: 'Sees if Pipi approves that!',
	async run(msg, args, client){
    const pipiApproveArray = [
      '**Pipilynn approves**',
      '**Pipilynn disapproves**'
    ]
    const approve = Math.floor(Math.random() * 2)
    if (pipiApproveArray[approve] === `**Pipilynn approves**`) {
      msg.channel.send(pipiApproveArray[approve] + ` ${args.join(" ")}`)
      msg.channel.send(`https://media.discordapp.net/attachments/740018913487749191/756949693761716344/Pipiproval.gif`)
    } else {
      const canvas = Canvas.createCanvas(640, 640);
	    const ctx = canvas.getContext('2d');  
	    const background = await Canvas.loadImage(`${__dirname}/../assets/oh-no-its-retarded.jpg`);
	    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	    const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));
	    ctx.drawImage(avatar, 365, 110, 170, 170);
      ctx.font = '30px "SourceSans" center';
      ctx.fillStyle = '#fffff';
      ctx.fillText(args.join(" "), 370, 80);
	    const attachment = new MessageAttachment(canvas.toBuffer(), 'disapproves.png');
      msg.channel.send(`${pipiApproveArray[approve]} ${args.join(" ")}`,attachment)
    }
	}
}