import fetch from "node-fetch";

import { getUrlsArr } from "./getUrlsArr.js";
import { getUpdateUrl } from "./getUpdateUrl.js";
import { getImageLink } from "./getImageLink.js";

const brandsIdForUrl = getUrlsArr();

export const getParseProducts = async (url, maxPrice, nameTypeProduct) => {
  const products = [];

  for (let brandId of brandsIdForUrl) {
    let page = 1;

    while (true && page <= 30) {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      try {
        const urlUpdate = getUpdateUrl(url, brandId, page);

        const response = await fetch(urlUpdate);

        const responseData = await response.json();

        if (!responseData.data.products.length) {
          break;
        }

        responseData.data.products.forEach(
          ({ id, name, salePriceU, brand, sale, volume, reviewRating }) => {
            if (salePriceU / 100 <= maxPrice) {
              products.push({
                id,
                name,
                salePriceU: salePriceU / 100,
                brand,
                sale,
                volume,
                imageLink: getImageLink(String(id)),
                reviewRating,
              });
            }
          }
        );

        page++;
      } catch (error) {
        console.error(error);
        break;
      }
    }
  }

  return products;
};
