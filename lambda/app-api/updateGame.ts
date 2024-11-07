import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Print Event
  console.log("[EVENT]", JSON.stringify(event));
  
  // Extract gameId from path parameters
  const gameId = event.pathParameters?.gameId;

  // Check for missing gameId
  if (!gameId) {
    return {
      statusCode: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Missing gameId in path parameters" }),
    };
  }

  // Parse the body to get update data
  const updateData = JSON.parse(event.body || "{}");

  try {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME, // DynamoDB table name from environment
        Key: { id: Number(gameId) }, // Use `id` instead of `gameId`, and ensure it's a number
        UpdateExpression: "set title = :title, genre_ids = :genre_ids",
        ExpressionAttributeValues: {
          ":title": updateData.title,
          ":genre_ids": updateData.genre_ids,
        },
        ReturnValues: "ALL_NEW", // Return the updated item
      });
      

    // Execute the update command
    const response = await ddbDocClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: `Game with ID ${gameId} updated successfully.`,
        updatedGame: response.Attributes,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[ERROR] Updating game with ID ${gameId}:`, error);
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      console.error(`[ERROR] Updating game with ID ${gameId}:`, error);
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
};

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