import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create DynamoDB client and document client
const ddbClient = new DynamoDBClient({ region: process.env.REGION });

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    // Print Event for debugging purposes
    console.log("Event: ", event);

    // Send Scan Command to fetch all games from the DynamoDB table
    const commandOutput = await ddbClient.send(
      new ScanCommand({
        TableName: process.env.GAMES_TABLE,  // Adjust the environment variable to the games table
      })
    );

    // If no items are found, return a 404 response
    if (!commandOutput.Items || commandOutput.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "No games found" }),
      };
    }

    // Return the fetched games data in the response
    const body = {
      data: commandOutput.Items,
    };

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
  } catch (error: any) {
    console.log("Error: ", JSON.stringify(error));  // Log any errors for debugging
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message || error }),
    };
  }
};

// Helper function to create a DynamoDB Document Client (if needed for further use)
function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
