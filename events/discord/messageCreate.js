const { EmbedBuilder } = require("discord.js")
const discordMsgs = require("../../models/discordMsgs")
module.exports = async (Dclient, Rclient, message) => {
    if (message.author.bot) return;
    if (message.type && message.type === "Discord") {
        let reply;
        let user;
        let embed;
        if (message.reply_ids) {
            reply = await message.channel.fetchMessage(message.reply_ids[0])
            if (!reply.masquerade) user = Rclient.users.get(reply.author_id);
            embed = new EmbedBuilder()
                .setAuthor({ name: user ? user.username : reply.masquerade.name, iconURL: user ? user.avatar._id ? `https://autumn.revolt.chat/avatars/${user.avatar._id}/${user.avatar.filename}` : `https://api.revolt.chat/users/${user._id}/default_avatar` : reply.masquerade.avatar })
                .setColor(`#36393F`)
                .setDescription(`> ${reply.content.length >= 1980 ? `${reply.content.slice(0, 1980)}...` : reply.content}`)
        }
        let attach = [];
        if (message.attachments) {
            message.attachments.map(a => {
                let format = `https://autumn.revolt.chat/attachments/${a._id}/${a.filename}`;
                attach.push(format)
            })
        }

        try {
            let channel = Dclient.channels.cache.get(Rclient.config.channels.Discord);
            let webhooks = await channel.fetchWebhooks();
            let webhook = webhooks.find(g => g.owner.id === Dclient.user.id);
            if (!webhook) {
                await channel.createWebhook({
                    name: Dclient.user.username,
                    reason: "Creating bridge with Revolt & Discord"
                });

                webhooks = await channel.fetchWebhooks();
                webhook = webhooks.find(g => g.owner.id === Dclient.user.id);
            }
            let msg = await webhook.send({
                username: message.author.username,
                avatarURL: message.author.avatar._id ? `https://autumn.revolt.chat/avatars/${message.author.avatar._id}/${message.author.avatar.filename}` : `https://api.revolt.chat/users/${message.author._id}/default_avatar`,
                content: message.content.replace("<@!", "@").replace("<@", "@").replace(">", "") || undefined,
                files: attach.length > 0 ? attach : [],
                embeds: reply ? [embed] : []
            }).catch(() => { })

            await (new discordMsgs({
                Did: msg.id,
                Rid: message._id,
            }).save());

        } catch (e) {
            console.warn(`[WARNING] Either Discord bot doesn't have permission to create webhooks or the webhook was being created!`)
            return message.react(encodeURI("👎")).catch(() => { })
        }
    } else {
        if (message.channel.id !== Rclient.config.channels.Discord) return;
        message.type = "Revolt";
        Rclient.emit("message", message)
    }
}