"use strict";
const { Client } = require("pg");
const { DBOPTIONS } = require("../constants");
const dbOptions = DBOPTIONS;

module.exports.createNewProduct = async (event) => {
  console.log(`event: ${event}`);

  const client = new Client(dbOptions);
  await client.connect();

  let body;

  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    body = JSON.parse(event.Records[0].body);
  }

  console.log(`body: ${JSON.stringify(body)}`);

  let { title, description, price, count } = body;
  let err;
  let statusCode = 200;
  price = Number(price);
  count = Number(count);

  try {
    if (typeof title !== "string") {
      throw new TypeError("wrong data type: title");
    } else if (typeof description !== "string") {
      throw new TypeError("wrong data type: description");
    } else if (!price) {
      throw new TypeError("wrong data type: price");
    } else if (!count) {
      throw new TypeError("wrong data type: count");
    }

    await client.query(
      `
        insert into products (title, description, price) values
            ($1, $2, $3)`,
      [title, description, price]
    );
    await client.query(
      `
        insert into stocks (product_id, count) values
            ((SELECT id from products WHERE title=$1 AND description=$2 AND price=$3),  $4)`,
      [title, description, price, count]
    );
    console.log(
      `Product added to db: ${title} ${description} ${price} ${count}`
    );
  } catch (error) {
    statusCode = error.name === "TypeError" ? 400 : 500;
    err = `Something went wrong in new product create process: ${error}`;
  }

  client.end();

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
