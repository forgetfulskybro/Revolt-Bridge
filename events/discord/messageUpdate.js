const revoltMsgs = require("../../models/revoltMsgs")
module.exports = async (Dclient, Rclient, oldMsg, newMsg) => {
    try {
        const db = await revoltMsgs.findOne({ Did: oldMsg.id });
        if (!db) return;
        let check = Rclient.messages.get(db.Rid)
        if (!check) return console.warn(`[WARNING] Edited message wasn't found on Revolt`)
        let msg = await Rclient.channels.get(Rclient.config.channels.Revolt).fetchMessage(db.Rid);
        await msg.edit({ content: newMsg.content }).catch(() => { })
    } catch {
        console.warn(`[ERROR] Message not found on Revolt/message didn't edit properly`)
    }
}