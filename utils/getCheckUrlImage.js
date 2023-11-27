import fetch from "node-fetch";

// Функция проверяющая по какой ссылке лежит изображение
export const getCheckUrlImage = async (url) => {
  let basketImageNumber = 1;

  while (true) {
    if (!(basketImageNumber <= 12)) {
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const urlReplaced = url.replace(
      url.slice(basketImageNumber > 9 ? 15 : 16, 17),
      basketImageNumber
    );

    const checkGetImage = await fetch(urlReplaced);

    if (checkGetImage.status === 200) {
      return urlReplaced;
    }

    basketImageNumber += 1;
  }
};
