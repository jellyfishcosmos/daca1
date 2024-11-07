import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Create DynamoDB client and document client
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);

// Lambda handler to delete a game
export const deleteGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { gameID } = event.pathParameters || {}; // Fetch gameID from pathParameters

    if (!gameID) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'gameID is required' }), // Bad request if gameID is missing
        };
    }

    try {
        // Set up the parameters to delete the game from DynamoDB
        const deleteParams = {
            TableName: process.env.GAMES_TABLE, // Ensure the table is for games
            Key: {
                id: gameID, // The key used to identify the game in DynamoDB
            },
        };

        // Execute the delete operation
        await dynamoDB.send(new DeleteCommand(deleteParams));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Game with ID ${gameID} deleted successfully.` }), // Success message
        };
    } catch (error) {
        console.error('Error deleting game:', error); // Log the error
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete game.' }), // Internal server error
        };
    }
};