# Revolt Bridge
A very simple way to bridge your Revolt & Discord servers together. This includes editing, deleting, and replying to messages.

## 🚧 Procedures

- [Node.js 14+](https://nodejs.org/en/download/)
- Edit `config.js` and provide the necessary channel IDs
- Add Revolt, Discord bot token, and MongoDB uri in `botconfig.json`
- Run `npm i` which will download all necessary packages
- Run the bot; Either use Node or PM2 (Process Manager 2)
  - `node index.js`
  - `pm2 start index.js --name BridgeBot`
    - Download: `npm i pm2@latest -g`

## 🖥️ Screenshots

- Revolt
<img src="/assets/RevoltImage.png">

- Discord
<img src="/assets/DiscordImage.png">