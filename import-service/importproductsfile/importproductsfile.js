"use strict";
const { S3 } = require("aws-sdk");

module.exports.importProductsFile = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const path = `uploaded/${name}`;

    const s3 = new S3({ region: "eu-west-1" });

    const params = {
      Bucket: "rs-task-5-uploaded",
      Key: path,
      Expires: 60,
      ContentType: "text/csv",
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: signedUrl,
    };
  } catch (err) {
    console.error("importProductsFile error:  ", err);
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 500,
      body: JSON.stringify("importProductsFile error:  ", err.message),
    };
  }
};
