// import fetch from "node-fetch";

// const accProducts = {
//   woman: { outerwear: [], clothes: [], shoes: [], bags: [] },
// };

// const getParseProducts = async (url, maxPrice, category, nameTypeProduct) => {
//   const requestPromises = brandsIdForUrl.map(async (brandId) => {
//     let page = 1;

//     while (true) {
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       try {
//         const urlUpdate = getUpdateUrl(url, brandId, page);

//         const response = await fetch(urlUpdate);

//         const responseData = await response.json();

//         if (!responseData.data.products.length) {
//           break;
//         }

//         responseData.data.products.forEach(
//           ({ id, name, salePriceU, brand, sale, volume, reviewRating }) => {
//             if (volume === 1 && salePriceU / 100 <= maxPrice) {
//               accProducts.woman[category].push({
//                 id,
//                 name,
//                 salePriceU: salePriceU / 100,
//                 brand,
//                 sale,
//                 volume,
//                 imageLink: getImageLink(String(id)),
//                 reviewRating,
//               });
//             }
//           }
//         );

//         page++;
//       } catch (error) {
//         console.error(error);
//         break;
//       }
//     }
//   });

//   await Promise.all(requestPromises);

//   console.log(accProducts, nameTypeProduct);
// };

// const waitSend = await bot.sendMessage(
//   chatId,
//   "Ожидайте товары грузятся..."
// );

// bot.deleteMessage(chatId, waitSend.message_id);

// []
//   .concat(
//     accProducts.woman.outerwear,
//     accProducts.woman.clothes,
//     accProducts.woman.shoes,
//     accProducts.woman.bags
//   )
//   .forEach(async (product) => {  // )
// }
