import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();
const translate = new AWS.Translate();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Event: ", event);

    const id = event?.pathParameters?.id;
    const language = event.queryStringParameters?.language;

    if (!id) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid game Id" }),
      };
    }


    if (!language) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid language entered" }),
      };
    }

    const reviewResponse = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: parseInt(id) },
      })
    );

    if (!reviewResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Game not found'
        })
      };
    }

    console.log("Retrieved Item: ", JSON.stringify(reviewResponse.Item));

    const text = reviewResponse.Item.overview;

    if (!text) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No content available for translation',
        }),
      };
    }

    console.log("Text to translate: ", text);

    const translateParams = {
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: language,
    };

    const translatedMessage = await translate.translateText(translateParams).promise();

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: translatedMessage,
      }),
    };

  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
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