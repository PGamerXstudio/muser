const prefixset = require('./models/prefix.js');
const userinfo = require('./models/user.js');
const Discord = require('discord.js')
const mongoose = require("mongoose");
mongoose.connect('MONGO_CONNECTION_URL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: ".",
        token: ""
    };
 
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true, highWaterMark: 1 << 25 })
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

distube.on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100
})
let mode = null




distube.on("playSong", (message, queue, song) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Playing song!`)
    .setDescription
    (`Plating : ${song.name}
Requested By : ${song.user}
Duration : ${song.formattedDuration}
Filter : ${queue.filter || "Off"}
Loop :  ${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`)
    .setColor("GREEN")
    .setImage(song.thumbnail)
message.channel.send(embed)
})
.on("addSong", (message, queue, song) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Added song!`)
    .setDescription
    (`Song Name : ${song.name}
Requested By : ${song.user}
Duration : ${song.formattedDuration}
Filter : ${queue.filter || "Off"}
Loop :  ${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`)

    .setColor("GREEN")
    .setImage(song.thumbnail)
message.channel.send(embed)
})
.on("playList", (message, queue, playlist, song) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Playing Playlist`)
    .setDescription
    (`PlayList Name : ${playlist.name}
Requested By : ${playlist.user}
No of Songs : ${playlist.songs.length}
Filter : ${queue.filter || "Off"}
Loop :  ${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`)

    .addField(`Now Playing`,song.name)
    .setColor("GREEN")
    .setImage(song.thumbnail)
    message.channel.send(embed)
})
.on("addList", (message, queue, playlist) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Playlist Added`)
    .setDescription
    (`PlayList Name : ${playlist.name}
Requested By : ${playlist.user}
No of Songs : ${playlist.songs.length}
Filter : ${queue.filter || "Off"}
Loop :  ${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`)

    .setColor("GREEN")
    message.channel.send(embed)
})
.on("searchResult", (message, result) => {
    let i = 0
    const embed = new Discord.MessageEmbed()
    .setTitle(`Choose an option from below`)
    .setDescription
    (`${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}`)
    .setColor("GREEN")
    .setFooter(`Type anything else or wait 60 seconds to cancel`)
    
    message.channel.send(embed)
})

.on("searchCancel", (message) => {
const cancel = new Discord.MessageEmbed()
.setTitle(`Searching Canceled`)
.setColor("RED")
message.channel.send(cancel)
})
.on("error", (message, err) => {
    const error = new Discord.MessageEmbed()
    .setTitle(`An Error occured`)
    .setDescription(`Error is --- ${err} . Make sure you ran command correctly`)
    .addField(`If you used it correctly`,"[Join our support server](https://pgamerx.com/discord)")
    .setColor("RED")
    message.channel.send(error)
})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setPresence({ activity: { name: `in ${client.guilds.cache.size} servers | .help` }, status: 'online' })
});
 


function catchErr(err,message){
    const error = new Discord.MessageEmbed()
    .setTitle(`An Error occured`)
    .setColor("RED")
    .setDescription(`Error is ${err} | Make sure you ran command properly`)
    .addField(`If you ran it correctly`, "[Join Our Server](https://discord.com/invite/y94PA8d)")
  return msg.channel.send(error)
  }
  
  client.on("debug", console.debug);
  client.on("warn", console.warn);
  client.on("error" , console.error);

  client.on("shardDisconnect", (event, id) =>
  console.log(
     `Shard ${id} disconnected (${event.code}) ${event}, trying to reconnect!`
    )
  );
   client.on("shardReconnecting", id => console.log(`Shard ${id} reconnecting...`));
  
client.on("message", async (message) => {

    try{

let msg = message



let bot = client






    const data = await prefixset.findOne({
        GuildID: message.guild.id
    })
    let prefix = null
    if(!data){
      prefix = "."
    }else{
      prefix = data.prefix
    }

    if (message.author.bot) return;
    

      const userdetail = await userinfo.findOne({
        UserID: msg.author.id
      })
      
      if(!userdetail){
        let newData = new userinfo({
          UserID: msg.author.id
      })
      newData.save()
      }
    
    

   if(message.mentions.has(bot.user) || message.content.includes(client.user.id)){
    msg.channel.send(
        `My Prefix for this server is **${prefix}** to change it do ${prefix}prefix`
      );
}
    if (!message.content.startsWith(prefix)) return;












    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
 
    if (command == "play"){
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
        distube.play(message, args.join(" "));
    }
if(command === "loop" || command === "repeat"){
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    if(args[0] !== "off" && args[0] !== "song" && args[0] !== "queue" ) return message.reply(`Correct usage is ${prefix}loop song/queue/off`)
     mode = distube.setRepeatMode(message, mode)     
       message.channel.send("Set repeat mode to `" + args[0] + "`")
}
    if (command == "stop") {
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
        distube.stop(message)
        message.channel.send("Stopped the music!")
    }
 

    if(command == "stats"){
        message.channel.send(`Hey there buddy! I am currently on ${client.guilds.cache.size} servers `)
    }
    if (command == "autoplay") {
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
    }

    if (command == "jump"){
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    distube.jump(message, parseInt(args[0]))
        .catch(err => message.channel.send("Invalid song number."));
}
if(command === "help"){
    const helpembed = new Discord.MessageEmbed()
    .setTitle(`Muser - The Revolutionary Discord Bot`)
    .setDescription
(`
**MUSIC COMMANDS**
-Use Prefix before all Commands

play - This is used to play music (Link or a search query. Link can also be a playlist link)
stop - Stops the music , deletes the queue
skip - skips current song and jumps onto next
pause - Pauses the song
resume - Resumes the song
autoplay - Enables autoplay .ie It'll automatically add songs according to your previous songs
seek - Seek to a specific part of song
queue - Displays all songs currently in the queue
3d - Applies 3d Filter
bassboost - Boosts the baas
echo - Enables an echo effect
karaoke - Enables karaoke effect
nightcore - Enables nightcore effect
flanger - Enables flanger effect
gate - Enables gate effect
haas - Enables haas effect
reverse - Plays song in reverse
surround - Enables surround effect
mcompand - Enables mcompand effect
phaser - Enables phaser effect
tremolo - Enables tremolo effect
earwax - Enables earwax effect

**IMPORTANT COMMAND**
bugged - If bot is bugged i.e It suddenly stopped playing music and is not leaving vc , then use this

**MISC COMMANDS**
-Use prefix before each command

stats - Status of the bot
support/discord - Give link to support server
ping - Tell ping of the bot
website - Gives link to the website
prefix - Shows current prefix of server and gives an option to change it! 
`)
.setColor("GREEN")
.addField(`Invite me`,"[Invite the bot](https://discord.com/oauth2/authorize?client_id=763418289689985035&scope=bot&permissions=37084480)")
.addField(`Support Server`,"[Support Server](https://discord.com/invite/y94PA8d)")
.addField(`Official Website`,"[Muser's website](https://muser.pgamerx.com)")
.addField(`Top.gg Page`,"[Top.gg](https://top.gg/bot/763418289689985035)")
message.channel.send(helpembed)
}


if(command === "prefix"){
    if(!args[0]) return message.channel.send(`Hey there bud ! Current prefix of the server is` +"`"+`${prefix}`+ "`" +`To change it do ${prefix}prefix NewPrefix. For eg - .prefix s!`)
if(args[0]){
    if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(`You are missing Manage server premission`)
    let newprefix = args[0]
    const data = await prefixset.findOne({
        GuildID: message.guild.id
    });
  
  
    if (args[0].length > 5) return message.channel.send('Your new prefix must be under \`5\` characters!')
  
    if (data) {
        await prefixset.findOneAndRemove({
            GuildID: message.guild.id
        })
        
        message.channel.send(`The new prefix is now **\`${args[0]}\`**`);
  
        let newData = new prefixset({
            prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save();
    } else if (!data) {
        message.channel.send(`The new prefix is now **\`${args[0]}\`**`);
  
        let newData = new prefixset({
            prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save()
    }
}
}


  if(command === "discord" || command === "support" || command === "server"){
    message.channel.send(`Our Support server - https://pgamerx.com/discord`)
  }

 




  if(command === "ping"){
    message.channel.send(`Am I supposed to say pong?`)
  }

  if(command === "volume"){
    let queuethere = distube.getQueue(message);
    if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
  
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
      const volume = args[0]
     let test = parseInt(args[0])
if(isNaN(test)) return message.channel.send(`You must provide a number`) 
if(test > 100) return message.channel.send(`Nope ! Volume has to be between 1 and 100`)
if(test < 1) return message.channel.send(`Nope ! Volume has to be between 1 and 100`)
distube.setVolume(message, test)
message.channel.send(`Volume has been set to ${test}%`)
  }

if(command === "invite"){
  const embed = new Discord.MessageEmbed()
    .addField(`Invite me`,"[Invite the bot](https://discord.com/oauth2/authorize?client_id=763418289689985035&scope=bot&permissions=37084480)")
message.channel.send(embed)
}


    if (command == "shuffle"){
        let queuethere = distube.getQueue(message);
        if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
      
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    distube.shuffle(message);} 

    if (command == "queue") {
        let queuethere = distube.getQueue(message);
        if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
        let queue = distube.getQueue(message)
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n"))
    }

    if(command === "bugged"){
        let queuethere = distube.getQueue(message);
        if(queuethere) return message.channel.send(`Heyyy I am not bugged! There is currently song being played in this server :)`)
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel as same as me in order to solve the issue')
        try{
        vc.leave()
        message.channel.send(`Ok issue fixed ! Now play songs again`)
        }catch(err){
            message.channel.send(`Error occured ! ${err}`)
        }
    }
 
    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`,`flanger`,`gate`,`haas`,`reverse`,`surround`,`mcompand`,`phaser`,`tremolo`,`earwax`,`off`].includes(command)) {

        let queuethere = distube.getQueue(message);
        if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
      
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
        let filter = distube.setFilter(message, command)
        const filterlol = new Discord.MessageEmbed()
        .setTitle(`Current Queue Filter - ${(filter || "Off")}`)
        .setColor("GREEN")
         message.channel.send(filterlol)

    }
    if(command === "seek"){
        let queuethere = distube.getQueue(message);
        if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
      
        try{
            let queue = distube.getQueue(message)
        const vc = await message.member.voice.channel
        if(!vc) return message.channel.send('You need to be in a Voice Channel :)')        
        if(!args) return message.channel.send(`You did not provide time ! Correct usage is ${prefix}seek Time . For eg - ${prefix}seek 1:20`)
        if(args.join(" ").split(":").length != 2)  return message.channel.send(`Correct usage is ${prefix}seek Time . For eg - ${prefix}seek 1:20`)
        if(args.join(" ").split(":").some(x => isNaN(x))) return message.channel.send(`Correct usage is ${prefix}seek Time . For eg - ${prefix}seek 1:20`)
    const time  =  args.join(" ").split(":").reduce((acc, element, index) => acc + (index == 0 ? element * 60 : element))
   if(!time) return message.channel.send(`You did not provide time ! Correct usage is ${prefix}seek Time . For eg - ${prefix}seek 1:20`)
const finaltime = parseInt(time) * 1000

let notmore = await queue.songs[0]
let bruh = notmore.formattedDuration
let bruhh = bruh.split(":").reduce((acc, element, index) => acc + (index == 0 ? element * 60 : element))
let yesboi = parseInt(bruhh) * 1000
if(finaltime > yesboi) return message.channel.send(`Boi you tried to seek to a duration that does not even exist smh`)
distube.seek(message, finaltime)
message.channel.send(`Seeked to **${args}**`)
        }catch(err){
            message.channel.send("An Unexpected error occured !```" + err + "```")
        }
}
if(command === "pause"){
    let queuethere = distube.getQueue(message);
    if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
  
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    distube.pause(message)
    message.channel.send(`Paused the song for you :)`)
}
if(command === "resume"){
    let queuethere = distube.getQueue(message);
    if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
  
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    distube.resume(message)
    message.channel.send(`Resumed the song for you`)
}
if(command === "skip"){
    let queuethere = distube.getQueue(message);
    if(!queuethere) return message.channel.send(`There is nothing in the queue right now ! **If I suddenly stopped playing your song and did not leave VC , that means I just restarted! So kindly run ${prefix}bugged**`)
  
    const vc = await message.member.voice.channel
    if(!vc) return message.channel.send('You need to be in a Voice Channel :)')
    distube.skip(message)

}
}catch(err){
    catchErr(err,message)
  }
})
client.login(config.token)
