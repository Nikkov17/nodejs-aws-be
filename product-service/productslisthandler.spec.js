const { getProductsList } = require("./productslisthandler");

const products = [
  {
    id: 1,
    title: "ford",
    price: 12000,
    year: 2015,
    engine: 2.0,
  },
  {
    id: 2,
    title: "ferari",
    price: 3000000,
    year: 2018,
    engine: 6.3,
  },
  {
    id: 3,
    title: "bmw",
    price: 24000,
    year: 2012,
    engine: 3.0,
  },
  {
    id: 4,
    title: "audi",
    price: 10000,
    year: 2008,
    engine: 2.0,
  },
];

test("returns request body with products list", async () => {
  expect(await getProductsList()).toEqual({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(products),
  });
});
