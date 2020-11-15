"use strict";
const { Client } = require("pg");
const { DBOPTIONS } = require("../constants");
const dbOptions = DBOPTIONS;

module.exports.fillInDB = async () => {
  let err;
  const client = new Client(dbOptions);
  await client.connect();

  await client.query(` CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  try {
    const ddlResult = await client.query(`
      create table if not exists products (
          id uuid DEFAULT uuid_generate_v4 (),
          title text,
          description text,
          price integer,
          PRIMARY KEY (id)
      )`);
    const ddlResult2 = await client.query(` 
      create table if not exists stocks (
          product_id uuid,
          count integer,
          foreign key ("product_id") references "products" ("id")
      )`);
    console.log(ddlResult, ddlResult2);

    const dmlResult = await client.query(`
        insert into products (title, description, price) values
            ('ford','strong and reliable car', 12000),
            ('ferari', 'fast as lightning', 3000000)`);
    const dmlResult2 = await client.query(`
        insert into stocks (product_id, count) values
            ((SELECT id from products WHERE title='ford' AND description='strong and reliable car' AND price=12000), 20),
            ((SELECT id from products WHERE title='ferari' AND description='fast as lightning' AND price=3000000), 3)`);
    console.log(dmlResult, dmlResult2);
  } catch (error) {
    err = `Error during database tables operations:${error}`;
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
    body: err ? err : "done",
  };
};
