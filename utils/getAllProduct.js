import { getParseProducts } from "./getParseProducts.js";

export const getAllProduct = async (requestArguments) => {
  try {
    const arr = [];
    for (let i = 0; i < requestArguments.length; i++) {
      const category = requestArguments[i];
      console.log(category.name);
      const parseProducts = await getParseProducts(
        category.url,
        category.maxPrice,
        category.name
      );
      parseProducts.forEach((item) => {
        arr.push(item);
      });
    }

    console.log(`Всего ${arr.length} товаров`);

    return arr;
  } catch (error) {
    // Обрабатываем возможные исключения
    console.error("Произошла ошибка при получении продуктов:", error);
    // return [];
  }
};
