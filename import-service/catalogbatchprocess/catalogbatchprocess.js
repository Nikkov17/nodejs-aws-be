"use strict";

module.exports.catalogBatchProcess = (event) => {
  const products = event.Records.map((record) => record.body);

  console.log(products);
};
