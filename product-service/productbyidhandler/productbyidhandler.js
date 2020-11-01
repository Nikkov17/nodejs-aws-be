"use strict";
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

module.exports.getProductById = async (event) => {
  let err;
  let resultProduct;
  let products;

  try {
    await readFile("./mocked-data/products.json", "utf8").then((data) => {
      products = JSON.parse(data);
    });
  } catch {
    err = "Something went wrong with products list";
  }

  try {
    const { pathParameters } = event;
    const productId = Number(pathParameters.productid);

    const correspondingProductsArray = products.filter((item) => {
      return item.id === productId;
    });
    resultProduct = correspondingProductsArray.length
      ? JSON.stringify(correspondingProductsArray[0])
      : "Item not found";
  } catch {
    err = "Something went wrong in search product by id process";
  }

  return {
    statusCode: 200,
    body: err ? err : resultProduct,
  };
};
