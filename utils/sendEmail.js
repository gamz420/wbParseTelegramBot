import nodemailer from "nodemailer";
import directTransport from "nodemailer-direct-transport";

export const sendEmail = async (mail) => {
  const fromHost = `mail.my`;
  const from = "sales" + "@" + fromHost;
  const transport = nodemailer.createTransport(
    directTransport({
      name: fromHost,
    })
  );

  transport.sendMail(
    {
      from,
      to: mail,
      subject: "Подписка оплачена",
      html: `
             <h1>Спасибо за покупку</h1>
             <p>
             Мы рады что вы выбрали именно нас! <br />
             Вы не пожалеете и уже в следующем месяце не захотите расставаться 😀 <br />
             А мы в свою очередь будем стараться сделать ваш шопинг ещё более выгодным и приятным для Вас 🔥 <br />
             Ссылка на бот: https://t.me/wb_resales_bot
             </p>
            `,
    },
    (err, data) => {
      if (err) {
        console.error("Ошибка при отправке:", err);
        return false;
      } else {
        console.log("Письмо отправлено");
        return true;
      }
    }
  );
};
