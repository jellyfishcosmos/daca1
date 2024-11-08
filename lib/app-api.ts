import { Aws } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as node from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import {games} from "../seed/games"
import { generateBatch } from "../shared/util";
import * as custom from "aws-cdk-lib/custom-resources";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";


type AppApiProps = {
  userPoolId: string;
  userPoolClientId: string;
};

export class AppApi extends Construct {
  constructor(scope: Construct, id: string, props: AppApiProps) {
    super(scope, id);

    const appApi = new apig.RestApi(this, "AppApi", {
      description: "Formula 1 App RestApi",
      endpointTypes: [apig.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowOrigins: apig.Cors.ALL_ORIGINS,
      },
    });

    const appCommonFnProps = {
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      environment: {
        USER_POOL_ID: props.userPoolId,
        CLIENT_ID: props.userPoolClientId,
        REGION: cdk.Aws.REGION,
      },
    };

// DynamoDB Tables
const gamesTable = new dynamodb.Table(this, "GameTable", {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  tableName: "Games",
});


   // Lambda Functions
const getGameByIdFn = new lambdanode.NodejsFunction(
  this,
  "GetGameByIdFn",
  {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_18_X,
    entry: `${__dirname}/../lambda/app-api/getGameById.ts`,
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      TABLE_NAME: gamesTable.tableName,
      REGION: 'eu-west-1',
    },
  }
);

const translationsTable = new dynamodb.Table(this, "TranslationsTable", {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  partitionKey: { name: "OriginalText", type: dynamodb.AttributeType.STRING },
  sortKey: { name: "TargetLanguage", type: dynamodb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  tableName: "Translations",
})

const getAllGamesFn = new lambdanode.NodejsFunction(
  this,
  "GetAllGamesFn",
  {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_18_X,
    entry: `${__dirname}/../lambda/app-api/getAllGames.ts`,
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      TABLE_NAME: gamesTable.tableName,
      REGION: 'eu-west-1',
    },
  }
);

new custom.AwsCustomResource(this, "gamesddbInitData", {
  onCreate: {
    service: "DynamoDB",
    action: "batchWriteItem",
    parameters: {
      RequestItems: {
        [gamesTable.tableName]: generateBatch(games),
      },
    },
    physicalResourceId: custom.PhysicalResourceId.of("gamesddbInitData"),
  },
  policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
    resources: [gamesTable.tableArn],
  }),
});

const newGameFn = new lambdanode.NodejsFunction(this, "AddGameFn", {
  architecture: lambda.Architecture.ARM_64,
  runtime: lambda.Runtime.NODEJS_16_X,
  entry: `${__dirname}/../lambda/app-api/addGame.ts`,
  timeout: cdk.Duration.seconds(10),
  memorySize: 128,
  environment: {
    TABLE_NAME: gamesTable.tableName,
    REGION: "eu-west-1",
  },
});

const deleteGameFn = new lambdanode.NodejsFunction(this, "DeleteGameFn", {
  architecture: lambda.Architecture.ARM_64,
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: `${__dirname}/../lambda/app-api/deleteGame.ts`,
  timeout: cdk.Duration.seconds(10),
  memorySize: 128,
  environment: {
    TABLE_NAME: gamesTable.tableName,
    REGION: "eu-west-1",
  },
});

const updateGameFn = new lambdanode.NodejsFunction(this, "UpdateGameFn", {
  architecture: lambda.Architecture.ARM_64,
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: `${__dirname}/../lambda/app-api/updateGame.ts`,
  timeout: cdk.Duration.seconds(10),
  memorySize: 128,
  environment: {
    TABLE_NAME: gamesTable.tableName,
    REGION: "eu-west-1",
  },
});

const getTranslationFn = new lambdanode.NodejsFunction(
  this,
  "GetTranslationFn",
  {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_16_X,
    entry: `${__dirname}/../lambda/app-api/translate.ts`,
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      TABLE_NAME: gamesTable.tableName,
      REGION: 'eu-west-1',
    },
  }
);

const translatePolicyStatement = new iam.PolicyStatement({
  actions: ["translate:TranslateText"],
  resources: ["*"],
});

getTranslationFn.addToRolePolicy(translatePolicyStatement);



// Permissions
gamesTable.grantReadData(getGameByIdFn);
gamesTable.grantReadData(getAllGamesFn);
gamesTable.grantReadWriteData(newGameFn);
gamesTable.grantReadWriteData(deleteGameFn);
gamesTable.grantReadWriteData(updateGameFn);
translationsTable.grantReadWriteData(getTranslationFn);  
    gamesTable.grantReadWriteData(getTranslationFn);

// REST API
const api = new apig.RestApi(this, "RestAPI", {
  description: "Demo API",
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowHeaders: ["Content-Type", "X-Amz-Date"],
    allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    allowCredentials: true,
    allowOrigins: ["*"],
  },
});

const gamesEndpoint = api.root.addResource("games");
gamesEndpoint.addMethod(
  "GET",
  new apig.LambdaIntegration(getAllGamesFn, { proxy: true }),
);

const gameEndpoint = gamesEndpoint.addResource("{gameId}");
gameEndpoint.addMethod(
  "GET",
  new apig.LambdaIntegration(getGameByIdFn, { proxy: true }),
  {
    requestParameters: {
  'method.request.querystring.company': false ,
  },}
);

const authorizerFn = new node.NodejsFunction(this, "AuthorizerFn", {
  ...appCommonFnProps,
  entry: "./lambda/auth/authorizer.ts",
});

const requestAuthorizer = new apig.RequestAuthorizer(
  this,
  "RequestAuthorizer",
  {
    identitySources: [apig.IdentitySource.header("cookie")],
    handler: authorizerFn,
    resultsCacheTtl: cdk.Duration.minutes(0),
  }
);

gamesEndpoint.addMethod(
  "POST",
  new apig.LambdaIntegration(newGameFn, { proxy: true }),
  {
    authorizer: requestAuthorizer,
    authorizationType: apig.AuthorizationType.CUSTOM,
  }
);

gameEndpoint.addMethod(
  "PUT",
  new apig.LambdaIntegration(updateGameFn, { proxy: true }),
  {
    authorizer: requestAuthorizer,
    authorizationType: apig.AuthorizationType.CUSTOM,
  }
);

gameEndpoint.addMethod(
  "DELETE",
  new apig.LambdaIntegration(deleteGameFn, { proxy: true }),
);

const translateEndpoint = gameEndpoint.addResource("translate");
translateEndpoint.addMethod(
  "GET",
  new apig.LambdaIntegration(getTranslationFn, { proxy: true }),
);
  }}
