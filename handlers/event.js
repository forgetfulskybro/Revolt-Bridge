const { readdirSync } = require("fs");
module.exports = (RevoltClient, DiscordClient) => {
    const REvents = readdirSync(`./events/revolt/`).filter(d => d.endsWith('.js'));
    for (let file of REvents) {
        let evt = require(`../events/revolt/${file}`);
        RevoltClient.on(file.split('.')[0].replace(/([A-Z])/g, '/$1').toLowerCase(), evt.bind(null, DiscordClient, RevoltClient));
    };

    const DEvents = readdirSync(`./events/discord/`).filter(d => d.endsWith('.js'));
    for (let file of DEvents) {
        let evt = require(`../events/discord/${file}`);
        DiscordClient.on(file.split('.')[0], evt.bind(null, DiscordClient, RevoltClient));
    };
};