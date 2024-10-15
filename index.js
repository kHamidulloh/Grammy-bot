require('dotenv').config();

const { hydrate } = require('@grammyjs/hydrate');
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());


bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Start bot'
    },
    {
        command: 'menu',
        description: 'Menu'
    }
])

bot.command('start', async (ctx) => {
    await ctx.react('❤‍🔥')
})

const menuKeyboard = new InlineKeyboard()
.text('Order status', 'order-status')
.text('Support','support')

const backKeyboard = new InlineKeyboard().text('< Back to the menu', 'back')
bot.command('menu', async (ctx) => {
    await ctx.reply('Choose the label menu', {
        reply_markup: menuKeyboard,
    })
})

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Status order arrive', {
        reply_markup: backKeyboard
    })
    await ctx.answerCallbackQuery()
})


bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Write your questions', {
        reply_markup: backKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Choose the label menu', {
        reply_markup: menuKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.log(`Error while handling update ${ctx.update.update_id}`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else {
        console.error("Unknown errors:", e);
    }
})

bot.start();