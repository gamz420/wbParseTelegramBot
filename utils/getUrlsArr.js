import { brands } from "../constants.js";

// WB разрешает за один запрос получать товары только по 20 брендам, поэтому собираем три ссылки по 20 брендов
export const getUrlsArr = () => {
  const brandsIdForUrl = ["", "", ""];

  // Расскидываем айди на три запроса так как за один запрос можно отправлять максимум 20 брендов
  Object.values(brands).forEach((product, idx) => {
    if (idx + 1 <= 20) {
      brandsIdForUrl[0] += product.id + ";";
    } else if (idx + 1 <= 40) {
      brandsIdForUrl[1] += product.id + ";";
    } else if (idx + 1 <= 60) {
      brandsIdForUrl[2] += product.id + ";";
    }
  });

  // Удаляем ; в конце в списке id
  brandsIdForUrl.forEach((idList, index) => {
    brandsIdForUrl[index] = idList.slice(0, -1);
  });

  return brandsIdForUrl;
};
