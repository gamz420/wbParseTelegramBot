import TelegramBot from "node-telegram-bot-api";
import env from "dotenv";
env.config();

import { getRandomProduct } from "./utils/getRandomProduct.js";
import { EMAIL_REGEXP } from "./constants.js";
import { savingPayment } from "./db/savingPayment.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const idsUsed = [];

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Оплатить", callback_data: "/pay" }]],
  }),
};

bot.on("callback_query", async (msg) => {
  if (msg.data === "/pay") {
    await savingPayment(msg);
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "/start") {
    bot.sendMessage(
      chatId,
      "Привет 👋🏻\nХочешь классно одеваться и при этом тратить по минимуму? Тогда ты по адресу!\n\n📛Острожно - это вызывает зависимость\n\n🛍️Теперь я - это незаменимая часть твоей жизни. Тут ты сможешь найти всё что искала ,но уже по выгодной цене.\n\nБренды: Mango, Befree, Zarina, Love Republic, Lime, Nike, Adidas, INCITY, Colin’s, O’STIN и др.\n\nДиапазон цен:\n👚Одежда - до 1500 рублей\n🧥Верхняя одежда - до 2500 рублей\n👡Обувь - до 2500 рублей\n👜Сумки - до 1300 рублей\n\n💲Стоимость подписки: 490 рублей\n\n📨 Для оформления подписки присылай свою почту."
    );
  }

  if (EMAIL_REGEXP.test(msg.text)) {
    bot.sendMessage(chatId, "Переходи по ссылке для оплаты", options);
  }

  if (msg.text === "/get") {
    setInterval(async () => {
      let product = {};
      while (true) {
        const result = await getRandomProduct();

        if (result && !idsUsed.includes(result.id)) {
          product = result;
          break;
        }
      }

      const description = `https://www.wildberries.ru/catalog/${product.id}/detail.aspx\n - ${product.name}\n - Бренд: ${product.brand}\n - Скидка: ${product.sale}%\n - Рейтинг: ${product.reviewRating}\n - Стоимость: ${product.salePriceU} руб.`;

      idsUsed.push(product.id);

      if (product.imageLink) {
        bot.sendPhoto(chatId, product.imageLink, {
          caption: description,
        });
      } else {
        bot.sendMessage(chatId, description);
      }
    }, 3600000);
  }
});

console.log("Bot started");
