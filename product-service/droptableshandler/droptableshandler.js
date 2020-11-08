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

module.exports.dropTables = async () => {
  let err;
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlResult = await client.query(`
      drop table if exists products CASCADE`);
    const ddlResult2 = await client.query(` 
    drop table if exists stocks CASCADE`);
    console.log(ddlResult, ddlResult2);
  } catch (error) {
    err = `Error during database tables drop operations:${error}`;
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
