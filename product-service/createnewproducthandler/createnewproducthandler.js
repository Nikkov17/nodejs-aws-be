"use strict";
const { Client } = require("pg");
const { DBOPTIONS } = require("../constants");
const dbOptions = DBOPTIONS;

module.exports.createNewProduct = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  const body = JSON.parse(event.body);
  const { title, description, price, count } = body;
  let err;
  let statusCode = 200;

  try {
    if (typeof title !== "string") {
      throw new TypeError("wrong data type: title");
    } else if (typeof description !== "string") {
      throw new TypeError("wrong data type: description");
    } else if (typeof price !== "number") {
      throw new TypeError("wrong data type: price");
    } else if (typeof count !== "number") {
      throw new TypeError("wrong data type: count");
    }

    const dmlResult = await client.query(
      `
        insert into products (title, description, price) values
            ($1, $2, $3)`,
      [title, description, price]
    );
    const dmlResult2 = await client.query(
      `
        insert into stocks (product_id, count) values
            ((SELECT id from products WHERE title=$1 AND description=$2 AND price=$3),  $4)`,
      [title, description, price, count]
    );
    console.log(dmlResult, dmlResult2);
  } catch (error) {
    statusCode = error.name === "TypeError" ? 400 : 500;
    err = `Something went wrong in new product create process: ${error}`;
  } finally {
    client.end();
  }

  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: err ? err : "done",
  };
};
