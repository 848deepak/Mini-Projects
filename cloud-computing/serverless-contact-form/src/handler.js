const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.submit = async (event) => {
  try {
    const data = JSON.parse(event.body);

    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    }

    const timestamp = new Date().getTime();
    
    const params = {
      TableName: process.env.CONTACTS_TABLE,
      Item: {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: timestamp,
      },
    };

    await dynamoDb.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully!" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
