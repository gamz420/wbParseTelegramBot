import TelegramBot from "node-telegram-bot-api";
import env from "dotenv";
env.config();

import { EMAIL_REGEXP, requestArguments } from "./constants.js";
import { savingPayment } from "./db/savingPayment.js";
import { sendEmail } from "./utils/sendEmail.js";
import { getAllProduct } from "./utils/getAllProduct.js";
import { getRandomInteger } from "./utils/getRandomInteger.js";
import { getCheckUrlImage } from "./utils/getCheckUrlImage.js";
import { connectToCluster } from "./db/connectToCluster.js";

const mongoClient = await connectToCluster(process.env.DB_URI);
const db = await mongoClient.db("wb_parse");
const col = await db.collection("paid_clients");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
  // request: {
  //   proxy: "http://127.0.0.1:1234",
  // },
});

const idsUsed = [];
let mail = "";

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Оплатить", callback_data: "/pay" }]],
  }),
};

const mainGetProductFunction = async () => {
  let products = [];

  products = await getAllProduct(requestArguments);
  setInterval(async () => {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    if (hours === 23 && minutes >= 30 && minutes <= 40) {
      products = await getAllProduct(requestArguments);
    }

    let product = {};

    while (true) {
      const randomProduct = products[getRandomInteger(0, products.length - 1)];

      const imageLink = await getCheckUrlImage(randomProduct.imageLink);

      randomProduct.imageLink = imageLink;

      if (randomProduct && !idsUsed.includes(randomProduct.id)) {
        product = randomProduct;
        break;
      }
    }
    const description = `https://www.wildberries.ru/catalog/${product.id}/detail.aspx\n - ${product.name}\n - Бренд: ${product.brand}\n - Скидка: ${product.sale}%\n - Рейтинг: ${product.reviewRating}\n - Стоимость: ${product.salePriceU} руб.`;

    idsUsed.push(product.id);

    const dbClients = await col.find().toArray();

    if (!!dbClients.length) {
      dbClients.forEach((cl) => {
        if (product.imageLink) {
          bot.sendPhoto(cl.chat_id, product.imageLink, {
            caption: description,
          });
        } else {
          bot.sendMessage(cl.chat_id, description);
        }
      });
    }
  }, 600000); // 10 min
  // }, 120000); // 2 min
};

bot.on("callback_query", async (msg) => {
  if (msg.data === "/pay") {
    const dbClients = await col.find().toArray();
    const clientsArr = await dbClients.map((cl) => {
      return cl.id;
    });

    if (clientsArr.includes(msg.from.id)) {
      return;
    }

    const resSave = await savingPayment(msg, mail);

    if (resSave) {
      await sendEmail(mail);
      bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
      bot.sendMessage(
        msg.message.chat.id,
        "Оплата успешна прошла!\n\nПроверьте почту, если не найдете письмо, ищите его в спаме.\n\nБот активирован, ожидайте, как он подберет товар он сразу же пришлёт его вам."
      );
    } else {
      bot.sendMessage(
        msg.message.chat.id,
        "Произошла ошибка, попробуйте позже"
      );
    }
  }
});

bot.on("message", async (msg) => {
  const dbClients = await col.find().toArray();
  const clientsArr = await dbClients.map((cl) => {
    return cl.id;
  });

  if (clientsArr.includes(msg.from.id)) {
    return;
  }

  if (msg.text === "/start") {
    bot.sendMessage(
      msg.chat.id,
      "Привет 👋🏻\nХочешь классно одеваться и при этом тратить по минимуму? Тогда ты по адресу!\n\n📛Острожно - это вызывает зависимость\n\n🛍️Теперь я - это незаменимая часть твоей жизни. Тут ты сможешь найти всё что искала ,но уже по выгодной цене.\n\nБренды: Mango, Befree, Zarina, Love Republic, Lime, Nike, Adidas, INCITY, Colin’s, O’STIN и др.\n\nДиапазон цен:\n👚Одежда - до 1500 рублей\n🧥Верхняя одежда - до 2500 рублей\n👡Обувь - до 2500 рублей\n👜Сумки - до 1300 рублей\n\n💲Стоимость подписки: 490 рублей\n\n📨 Для оформления подписки присылай свою почту."
    );
    return;
  }

  if (EMAIL_REGEXP.test(msg.text)) {
    mail = msg.text;
    bot.sendMessage(msg.chat.id, "Переходи по ссылке для оплаты", options);
  } else {
    bot.sendMessage(
      msg.chat.id,
      "Email адрес не валиден, проверьте написание и попробуйте снова"
    );
  }
});

console.log("Bot started");

mainGetProductFunction();
