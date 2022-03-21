const {readdirSync} = require("fs");

module.exports = Client => {
  const Load = Directory => {
    const CommandsArray = readdirSync(`./commands/${Directory}/`).filter(file => file.endsWith(".js"));
    
    for (let CurrentFile of CommandsArray) {
      let File = require(`./commands/${Directory}/${CurrentFile}`);
      Client.commands.set(File.config.name, File);
      
      if (File.config.aliases)
        File.config.aliases.forEach(Alias => Client.aliases.set(Alias, File.config.name));
    }
  };
  
  [`fun`, `utility`].forEach(Category => Load(Category))}