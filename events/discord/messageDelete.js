const revoltMsgs = require("../../models/revoltMsgs")
module.exports = async (Dclient, Rclient, message) => {
    try {
        const db = await revoltMsgs.findOne({ Did: message.id });
        if (!db) return;
        let check = Rclient.messages.get(db.Rid)
        if (!check) return console.warn(`[WARNING] Deleted message wasn't found on Revolt`)
        let msg = await Rclient.channels.get(Rclient.config.channels.Revolt).fetchMessage(db.Rid);
        await msg.delete().catch(() => { })
        await db.delete().catch(() => { })
    } catch {
        console.warn(`[ERROR] Message not found on Revolt/message didn't delete properly`)
    }
}