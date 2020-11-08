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

module.exports.fillInDB = async () => {
  let err;
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlResult = await client.query(`
      create table if not exists products (
          id serial primary key,
          title text,
          description text,
          price integer
      )`);
    const ddlResult2 = await client.query(`  
      create table if not exists stocks (
          id serial primary key,
          product_id integer,
          count integer,
          foreign key ("product_id") references "products" ("id")
      )`);

    const dmlResult = await client.query(`
        insert into products (title, description, price) values
            ('ford','strong and reliable car', 12000),
            ('ferari', 'fast as lightning', 3000000)`);
    const dmlResult2 = await client.query(`
        insert into stocks (product_id, count) values
            (1, 20),
            (2, 3);`);
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
