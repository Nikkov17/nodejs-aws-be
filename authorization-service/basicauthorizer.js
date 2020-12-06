"use strict";
const dotenv = require("dotenv");
dotenv.config();

module.exports.basicAuthorizer = async (event, context, cb) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  if (event.type !== "TOKEN") {
    cb("Unauthorized");
  }

  try {
    const authorizationToken = event.authorizationToken;

    if (!authorizationToken) cb("Unauthorized");
    if (
      authorizationToken.split(" ")[0] !== "Basic" ||
      !authorizationToken.split(" ")[1]
    ) {
      cb("Unauthorized");
    }

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`${username}: ${password}`);

    const storedPassword = process.env[username];
    const accessStatus = storedPassword && storedPassword === password;

    const IAMPolicy = generatePolicy(
      encodedCreds,
      event.methodArn,
      accessStatus
    );

    cb(null, IAMPolicy);
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (principalId, resource, accessStatus) => {
  const effect = accessStatus ? "Allow" : "Deny";

  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
