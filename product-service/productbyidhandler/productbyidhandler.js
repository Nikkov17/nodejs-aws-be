"use strict";
const { Client } = require("pg");
const { DBOPTIONS } = require("../constants");
const dbOptions = DBOPTIONS;

module.exports.getProductById = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  let err;
  let resultProduct;
  const { productid } = event.pathParameters;

  try {
    const {
      rows: resultProductRows,
    } = await client.query(
      `select products.*, stocks.count from products left join stocks on products.id=stocks.product_id where products.id=$1`,
      [productid]
    );
    resultProduct = resultProductRows[0];

    if (!resultProduct) {
      throw "Product does not exist";
    }
  } catch (error) {
    err = `Something went wrong in search product by id process: ${error}`;
  } finally {
    client.end();
  }

  return {
    statusCode: err ? 500 : 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: err ? err : JSON.stringify(resultProduct),
  };
};
