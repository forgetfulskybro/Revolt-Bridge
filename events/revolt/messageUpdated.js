const discordMsgs = require("../../models/discordMsgs")
module.exports = async (Dclient, Rclient, message, newMsg) => {
    try {
        if (newMsg.type === "MessageUpdate") {
            const db = await discordMsgs.findOne({ Rid: message._id });
            if (!db) return;
            let webhooks = await Dclient.channels.cache.get(Rclient.config.channels.Discord).fetchWebhooks();
            if (!webhooks) return console.warn(`[WARNING] Can't fetch webhooks from specified Discord channel`)
            let webhook = webhooks.find(g => g.owner.id === Dclient.user.id);
            if (!webhook) return console.warn(`[WARNING] Can't find webhook in specified Discord channel`)
            await webhook.editMessage(db.Did, { content: newMsg.data.content }).catch(() => { })
        }
    } catch (e) {
        console.log(e)
        console.warn(`[ERROR] Webhook wasn't found or I don't have permission to check for webhooks in specified Discord channel`)
    }
}