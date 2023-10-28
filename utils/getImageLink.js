// Функция по айди возвращающая ссылку на изображения
export const getImageLink = (id) => {
  if (id.length === 8) {
    return `https://basket-01.wb.ru/vol${String(id).slice(0, 3)}/part${String(
      id
    ).slice(0, 5)}/${id}/images/big/1.webp`;
  }

  if (id.length === 9) {
    return `https://basket-01.wb.ru/vol${String(id).slice(0, 4)}/part${String(
      id
    ).slice(0, 6)}/${id}/images/big/1.webp`;
  }

  return `https://basket-01.wb.ru/vol${String(id).slice(0, 2)}/part${String(
    id
  ).slice(0, 4)}/${id}/images/big/1.webp`;
};
