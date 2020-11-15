"use strict";
const { S3 } = require("aws-sdk");
const { BUCKET, REGION } = require("../constants");
const csv = require("csv-parser");

processRecord = async (Key, s3) => {
  const params = {
    Bucket: BUCKET,
    Key,
  };

  const s3Stream = s3.getObject(params).createReadStream();

  s3Stream
    .pipe(csv())
    .on("data", (data) => {
      console.log(JSON.stringify(data, null, 4));
    })
    .on("end", resolve)
    .on("error", reject);
};

module.exports.importFileParser = async (event) => {
  try {
    const s3 = new S3({ region: REGION });
    const { Records } = event;

    for (const record of Records) {
      await processRecord(record.s3.object.key, s3);

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
    }
  } catch (err) {
    console.error(err);
  }
};
