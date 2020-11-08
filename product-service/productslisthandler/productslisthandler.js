"use strict";
const { Client } = require("pg");
const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

module.exports.getProductsList = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  let err;
  let products;

  try {
    const { rows: productsRows } = await client.query(
      `select products.*, stocks.count from products left join stocks on products.id=stocks.product_id;`
    );
    products = productsRows;
  } catch (error) {
    err = `Something went wrong with products list reading: ${error}`;
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
    body: err ? err : JSON.stringify(products),
  };
};
