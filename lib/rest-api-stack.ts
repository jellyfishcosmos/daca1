// import * as cdk from "aws-cdk-lib";
// import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
// import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// import * as custom from "aws-cdk-lib/custom-resources";
// import { Construct } from "constructs";
// import * as apig from "aws-cdk-lib/aws-apigateway";
// import { generateGameCompanyBatch, generateGameBatch } from "../shared/util";
// import { games, gameCompanies } from "../seed/games";  // Adjusted to game data

// export class RestAPIStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // Tables
//     const gamesTable = new dynamodb.Table(this, "GamesTable", {
//       billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
//       partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       tableName: "Games",
//     });

//     const gameCompaniesTable = new dynamodb.Table(this, "GameCompanyTable", {
//       billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
//       partitionKey: { name: "gameId", type: dynamodb.AttributeType.NUMBER },
//       sortKey: { name: "companyName", type: dynamodb.AttributeType.STRING },
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       tableName: "GameCompanies",
//     });

//     gameCompaniesTable.addLocalSecondaryIndex({
//       indexName: "roleIx",
//       sortKey: { name: "roleName", type: dynamodb.AttributeType.STRING },
//     });

//     // Functions
//     const getGameCompaniesFn = new lambdanode.NodejsFunction(
//       this,
//       "GetGameCompaniesFn",
//       {
//         architecture: lambda.Architecture.ARM_64,
//         runtime: lambda.Runtime.NODEJS_16_X,
//         entry: `${__dirname}/../lambdas/getGameCompanies.ts`,
//         timeout: cdk.Duration.seconds(10),
//         memorySize: 128,
//         environment: {
//           TABLE_NAME: gameCompaniesTable.tableName,
//           REGION: "eu-west-1",
//         },
//       }
//     );

//     const getGameByIdFn = new lambdanode.NodejsFunction(
//       this,
//       "GetGameByIdFn",
//       {
//         architecture: lambda.Architecture.ARM_64,
//         runtime: lambda.Runtime.NODEJS_18_X,
//         entry: `${__dirname}/../lambdas/getGameById.ts`,
//         timeout: cdk.Duration.seconds(10),
//         memorySize: 128,
//         environment: {
//           TABLE_NAME: gamesTable.tableName,
//           REGION: 'eu-west-1',
//         },
//       }
//     );

//     const getAllGamesFn = new lambdanode.NodejsFunction(
//       this,
//       "GetAllGamesFn",
//       {
//         architecture: lambda.Architecture.ARM_64,
//         runtime: lambda.Runtime.NODEJS_18_X,
//         entry: `${__dirname}/../lambdas/getAllGames.ts`,
//         timeout: cdk.Duration.seconds(10),
//         memorySize: 128,
//         environment: {
//           TABLE_NAME: gamesTable.tableName,
//           REGION: 'eu-west-1',
//         },
//       }
//     );

//     // Initialize DynamoDB with seed data
//     new custom.AwsCustomResource(this, "gamesddbInitData", {
//       onCreate: {
//         service: "DynamoDB",
//         action: "batchWriteItem",
//         parameters: {
//           RequestItems: {
//             [gamesTable.tableName]: generateGameBatch(games),
//             [gameCompaniesTable.tableName]: generateGameCompanyBatch(gameCompanies),  // Updated seed data for game companies
//           },
//         },
//         physicalResourceId: custom.PhysicalResourceId.of("gamesddbInitData"),
//       },
//       policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
//         resources: [gamesTable.tableArn, gameCompaniesTable.tableArn],  // Includes game companies
//       }),
//     });

//     // Permissions
//     gamesTable.grantReadData(getGameByIdFn);
//     gamesTable.grantReadData(getAllGamesFn);
//     gameCompaniesTable.grantReadData(getGameCompaniesFn);

//     // API Gateway
//     const api = new apig.RestApi(this, "RestAPI", {
//       description: "Game API",
//       deployOptions: {
//         stageName: "dev",
//       },
//       defaultCorsPreflightOptions: {
//         allowHeaders: ["Content-Type", "X-Amz-Date"],
//         allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
//         allowCredentials: true,
//         allowOrigins: ["*"],
//       },
//     });

//     const gamesEndpoint = api.root.addResource("games");
//     gamesEndpoint.addMethod(
//       "GET",
//       new apig.LambdaIntegration(getAllGamesFn, { proxy: true })
//     );

//     const gameEndpoint = gamesEndpoint.addResource("{gameId}");
//     gameEndpoint.addMethod(
//       "GET",
//       new apig.LambdaIntegration(getGameByIdFn, { proxy: true })
//     );

//     const newGameFn = new lambdanode.NodejsFunction(this, "AddGameFn", {
//       architecture: lambda.Architecture.ARM_64,
//       runtime: lambda.Runtime.NODEJS_16_X,
//       entry: `${__dirname}/../lambdas/addGame.ts`,  // Assuming addGame Lambda function
//       timeout: cdk.Duration.seconds(10),
//       memorySize: 128,
//       environment: {
//         TABLE_NAME: gamesTable.tableName,
//         REGION: "eu-west-1",
//       },
//     });

//     gamesTable.grantReadWriteData(newGameFn);
//     gamesEndpoint.addMethod(
//       "POST",
//       new apig.LambdaIntegration(newGameFn, { proxy: true })
//     );

//     const deleteGameLambda = new lambdanode.NodejsFunction(this, 'DeleteGameLambda', {
//       architecture: lambda.Architecture.ARM_64,
//       runtime: lambda.Runtime.NODEJS_18_X,  
//       entry: `${__dirname}/../lambdas/deleteGame.ts`,  
//       timeout: cdk.Duration.seconds(10),
//       memorySize: 128,
//       environment: {
//         TABLE_NAME: gamesTable.tableName,
//         REGION: "eu-west-1",
//       },
//     });

//     const gameCompanyEndpoint = gamesEndpoint.addResource("companies");
//     gameCompanyEndpoint.addMethod(
//       "GET",
//       new apig.LambdaIntegration(getGameCompaniesFn, { proxy: true })
//     );

//     gamesTable.grantWriteData(deleteGameLambda);

//     gameEndpoint.addMethod('DELETE', new apig.LambdaIntegration(deleteGameLambda, { proxy: true }));
//   }
// }
