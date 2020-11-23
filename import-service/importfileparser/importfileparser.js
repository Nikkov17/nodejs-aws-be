"use strict";
const { S3, SQS } = require("aws-sdk");
const { BUCKET, REGION } = require("../constants");
const csv = require("csv-parser");

module.exports.importFileParser = (event) => {
  try {
    const s3 = new S3({ region: REGION });
    const sqs = new SQS();
    const { Records } = event;

    for (const record of Records) {
      const Key = record.s3.object.key;
      const params = {
        Bucket: BUCKET,
        Key,
      };

      const s3Stream = s3.getObject(params).createReadStream();

      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          const csvString = JSON.stringify(data);
          console.log(`csvString: ${csvString}`);

          let products = JSON.parse(csvString);
          if (!Array.isArray(products)) {
            products = [products];
          }

          products.forEach((product) => {
            sqs.sendMessage(
              {
                QueueUrl:
                  "https://sqs.eu-west-1.amazonaws.com/381077858456/catalogItemsQueue",
                MessageBody: JSON.stringify(product),
              },
              (error, product) => {
                if (error) {
                  console.log(`error: ${error.message}`);
                } else {
                  console.log(
                    `Send product to queue: ${JSON.stringify(product)}`
                  );
                }
              }
            );
          });
        })
        .on("end", async () => {
          const Key = record.s3.object.key.replace("uploaded", "parsed");

          await s3
            .copyObject({
              Bucket: BUCKET,
              Key,
              CopySource: `${BUCKET}/${record.s3.object.key}`,
            })
            .promise();

          await s3
            .deleteObject({ Bucket: BUCKET, Key: record.s3.object.key })
            .promise();
        });
    }
  } catch (err) {
    console.error(err);
  }
};
