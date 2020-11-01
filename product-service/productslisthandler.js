"use strict";
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

module.exports.getProductsList = async () => {
  let err;
  let products;

  try {
    await readFile("./mocked-data/products.json", "utf8").then((data) => {
      products = JSON.parse(data);
    });
  } catch {
    err = "Something went wrong with products list";
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: err ? err : JSON.stringify(products),
  };
};
