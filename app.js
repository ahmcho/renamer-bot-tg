require("dotenv").config();
const {
  Telegraf,
  Markup
} = require('telegraf')

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!')
}

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('❤️', 'http://telegraf.js.org'),
  Markup.button.callback('Delete', 'delete')
])

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('channel_post', async (ctx) => {
  if (ctx.update.channel_post.video) {
    let filename = ctx.update.channel_post.video.file_name.split('.')[0];
    if (filename.match(/_/)) {
      filename = filename.replace(/_/gm, ' ');
    }
    await ctx.deleteMessage(ctx.update.channel_post.message_id);
    await ctx.replyWithVideo(ctx.update.channel_post.video.file_id, {
      caption: `${filename}`
    });
  }

});
bot.action('delete', (ctx) => ctx.deleteMessage())
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))