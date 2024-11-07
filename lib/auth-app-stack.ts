import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { AuthApi } from "./auth-api";
import { AppApi } from "./app-api";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { games, gameCompanies } from "../seed/games";
import { generateBatch } from "../shared/util";

export class AuthAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // GameCompanies table
    const gameCompaniesTable = new dynamodb.Table(this, "GameCompaniesTable", {
      partitionKey: { name: "companyId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: "GameCompanies",
    });

    // Games table
    const gamesTable = new dynamodb.Table(this, "GamesTable", {
      partitionKey: { name: "companyId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "gameId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: "Games",
    });

    // MARSHALLING DATA FOR TABLES
    new custom.AwsCustomResource(this, "gamesTableInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [gamesTable.tableName]: generateBatch(games),
            [gameCompaniesTable.tableName]: generateBatch(gameCompanies),
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of(
          "gamesTableInitData"
        ),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [gamesTable.tableArn, gameCompaniesTable.tableArn],
      }),
    });

    // Cognito User Pool for authentication
    const userPool = new UserPool(this, "UserPool", {
      signInAliases: { username: true, email: true },
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolId = userPool.userPoolId;
    const appClient = userPool.addClient("AppClient", {
      authFlows: { userPassword: true },
    });

    const userPoolClientId = appClient.userPoolClientId;

    new AuthApi(this, "AuthServiceApi", {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
    });

    new AppApi(this, "AppApi", {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      gamesTable: gamesTable,
      gameCompanyTable: gameCompaniesTable,
    });
  }}