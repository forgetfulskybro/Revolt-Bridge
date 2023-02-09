const https = require("https");
const revoltMsgs = require("../../models/revoltMsgs")
const discordMsgs = require("../../models/discordMsgs")
module.exports = async (Dclient, Rclient, message) => {
    if (message.author.bot) return;
    if (message.type && message.type === "Revolt") {
        let reply;
        if (message.reference) {
            reply = await discordMsgs.findOne({ Did: message.reference.messageId });
            if (!reply) reply = await revoltMsgs.findOne({ Did: message.reference.messageId });
            if (!reply) console.warn(`[WARNING] Replied message wasn't found in database`)
        }

        if (message.content) {
            let msg = await Rclient.channels.get(Rclient.config.channels.Revolt).sendMessage({
                content: message.content || undefined,
                replies: reply ? [{ id: reply.Rid, mention: false }] : undefined,
                masquerade: {
                    name: message.author.username,
                    avatar: message.author.displayAvatarURL(),
                }
            }).catch(() => { })
            await (new revoltMsgs({
                Did: message.id,
                Rid: msg._id
            }).save());
        }

        if (message.attachments.first()) {
            try {
                message.attachments.map(a => {
                    https.get(a.url, async (sp) => {
                        let msg = await Rclient.channels.get(Rclient.config.channels.Revolt).sendMessage({
                            attachments: [await Rclient.Uploader.upload(sp, a.name || "Unknown")],
                            replies: reply ? [{ id: reply.Rid, mention: false }] : undefined,
                            masquerade: {
                                name: message.author.username,
                                avatar: message.author.displayAvatarURL(),
                            }
                        }).catch(() => { })
                        await (new revoltMsgs({
                            Did: message.id,
                            Rid: msg._id
                        }).save());
                    });
                })
            } catch {  }
        }
    } else {
        if (message.channel_id !== Rclient.config.channels.Revolt) return;
        message.type = "Discord";
        Dclient.emit("messageCreate", message)
    }
}