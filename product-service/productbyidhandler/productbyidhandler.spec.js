const { getProductById } = require("./productbyidhandler");

test("returns request body with 2 product", async () => {
  const neededProduct = {
    id: 2,
    title: "ferari",
    price: 3000000,
    year: 2018,
    engine: 6.3,
  };
  const event = {
    pathParameters: {
      productid: 2,
    },
  };

  expect(await getProductById(event)).toEqual({
    statusCode: 200,
    body: JSON.stringify(neededProduct),
  });
});
