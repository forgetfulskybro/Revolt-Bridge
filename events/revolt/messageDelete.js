const discordMsgs = require("../../models/discordMsgs")
module.exports = async (Dclient, Rclient, id, message) => {
    try {
        const db = await discordMsgs.findOne({ Rid: id });
        if (!db) return;
        let webhooks = await Dclient.channels.cache.get(Rclient.config.channels.Discord).fetchWebhooks();
        if (!webhooks) return console.warn(`[WARNING] Can't fetch webhooks from specified Discord channel`)
        let webhook = webhooks.find(g => g.owner.id === Dclient.user.id)
        if (!webhook) return console.warn(`[WARNING] Can't find webhook in specified Discord channel`)
        await webhook.deleteMessage(db.Did).catch(() => { })
        await db.delete().catch(() => { })
    } catch (e) {
        console.log(e)
        console.warn(`[ERROR] Webhook wasn't found or I don't have permission to check for webhooks in specified Discord channel`)
    }
}