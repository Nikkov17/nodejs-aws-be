"use strict";
const products = require("./mocked-data/products");

module.exports.getProductById = async (event) => {
  event = { path: "/2" };

  const splittedPath = event.path.split("/");
  const productId = Number(splittedPath[splittedPath.length - 1]);
  const correspondingProductsArray = products.filter((item) => {
    return item.id === productId;
  });

  return {
    statusCode: 200,
    body: correspondingProductsArray.length
      ? JSON.stringify(correspondingProductsArray[0])
      : "Item not found",
  };
};
