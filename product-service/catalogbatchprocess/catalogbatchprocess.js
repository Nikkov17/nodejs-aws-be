"use strict";
const { SNS } = require("aws-sdk");

module.exports.catalogBatchProcess = async (event) => {
  const products = event.Records.map((record) => record.body);
  console.log(`products: ${products}`);

  const sns = new SNS({ region: "eu-west-1" });

  await sns
    .publish(
      {
        Subject: "Products created",
        Message: `Your products has been created: ${products}`,
        TopicArn: process.env.SNS_ARN,
      },
      (error) => {
        if (error) {
          console.log(`error: ${error.message}`);
        } else {
          console.log(`Send email about products creation: ${products}`);
        }
      }
    )
    .promise();
};
