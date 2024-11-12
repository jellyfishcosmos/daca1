import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const ddbDocClient = createDDbDocClient();


//changed mainly from moviesAPI

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
  
    try {
      // Prepare the DeleteCommand
      const command = new DeleteCommand({
        TableName: process.env.TABLE_NAME, // DynamoDB table name from environment
        Key: { id :Number(gameId)  }, // Primary key for the game to be deleted
      });
  
      // Execute the delete command
      await ddbDocClient.send(command);
  
      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: `game with ID ${gameId} deleted successfully.` }),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[ERROR] Deleting game with ID ${gameId}:`, error);
        return {
          statusCode: 500,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ error: error.message }),
        };
      } else {
        console.error(`[ERROR] Deleting game with ID ${gameId}:`, error);
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