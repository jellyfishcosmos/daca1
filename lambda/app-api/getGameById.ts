import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
//import { gameCompanies } from '../../seed/games';  

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    // Print Event
    console.log("[EVENT]", JSON.stringify(event));

    // Retrieve id from path parameters
    const parameters = event?.pathParameters;
    const id = parameters?.id ? parseInt(parameters.id) : undefined;

    if (!id) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Missing game Id" }),
      };
    }

    // Check for query parameter to include game companies
    const companiesIncluded = event.queryStringParameters?.companies === 'true';

    // Fetch the game details from DynamoDB
    const commandOutput = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.GAMES_TABLE,  // Make sure to set the correct table name
        Key: { id: id },
      })
    );
    console.log("GetCommand response: ", commandOutput);

    // If no game is found, return a 404
    if (!commandOutput.Item) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid game Id" }),
      };
    }

    // Prepare the response body
    let responseBody = { data: commandOutput.Item };

    // // If the query includes "companies=true", add the game companies
    // if (companiesIncluded) {
    //   const companies = getGameCompanies(id);
    //   responseBody.data.companies = companies;
    // }

    // Return Response
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(responseBody),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message || error }),
    };
  }
};

// Create DynamoDB Document Client
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

// // Get the companies associated with a specific id
// function getGameCompanies(id: number) {
//   return gameCompanies.filter(company => company.id === id);
// }

