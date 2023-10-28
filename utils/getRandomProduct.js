import { requestArguments } from "../constants.js";
import { getCheckUrlImage } from "./getCheckUrlImage.js";
import { getParseProducts } from "./getParseProducts.js";
import { getRandomInteger } from "./getRandomInteger.js";

export const getRandomProduct = async () => {
  const randomCategoryIndex = getRandomInteger(0, requestArguments.length - 1);
  const category = requestArguments[randomCategoryIndex];

  const parseProducts = await getParseProducts(
    category.url,
    category.maxPrice,
    category.name
  );

  if (!!parseProducts.length) {
    const randomProduct =
      parseProducts[getRandomInteger(0, parseProducts.length - 1)];

    const imageLink = await getCheckUrlImage(randomProduct.imageLink);

    randomProduct.imageLink = imageLink;

    return randomProduct;
  }
};
