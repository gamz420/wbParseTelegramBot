// Функция подставляющая в url значения айди брендов и страницы поиска
export const getUpdateUrl = (url, brandId, page) => {
  return url.replace("${brandId}", brandId).replace("${page}", page);
};
