export const TEMPLATE_JSON = {
  AWSTemplateFormatVersion: "2010-09-09",
  Description: "An example AWS CloudFormation template",
  Resources: {
    ServerlessDeploymentBucket: {
      Type: "AWS::S3::Bucket",
      Properties: {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: "AES256",
              },
            },
          ],
        },
      },
    },
    ServerlessDeploymentBucketPolicy: {
      Type: "AWS::S3::BucketPolicy",
      Properties: {
        Bucket: {
          Ref: "ServerlessDeploymentBucket",
        },
        PolicyDocument: {
          Statement: [
            {
              Action: "s3:*",
              Effect: "Deny",
              Principal: "*",
              Resource: [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        Ref: "AWS::Partition",
                      },
                      ":s3:::",
                      {
                        Ref: "ServerlessDeploymentBucket",
                      },
                      "/*",
                    ],
                  ],
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        Ref: "AWS::Partition",
                      },
                      ":s3:::",
                      {
                        Ref: "ServerlessDeploymentBucket",
                      },
                    ],
                  ],
                },
              ],
              Condition: {
                Bool: {
                  "aws:SecureTransport": false,
                },
              },
            },
          ],
        },
      },
    },
    ProducerLogGroup: {
      Type: "AWS::Logs::LogGroup",
      Properties: {
        LogGroupName: "/aws/lambda/aws-node-sqs-worker-project-dev-producer",
      },
    },
    JobsWorkerLogGroup: {
      Type: "AWS::Logs::LogGroup",
      Properties: {
        LogGroupName: "/aws/lambda/my_worker_function",
      },
    },
    IamRoleLambdaExecution: {
      Type: "AWS::IAM::Role",
      Properties: {
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: ["lambda.amazonaws.com"],
              },
              Action: ["sts:AssumeRole"],
            },
          ],
        },
        Policies: [
          {
            PolicyName: {
              "Fn::Join": [
                "-",
                ["aws-node-sqs-worker-project", "dev", "lambda"],
              ],
            },
            PolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup",
                    "logs:TagResource",
                  ],
                  Resource: [
                    {
                      "Fn::Sub":
                        "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/aws-node-sqs-worker-project-dev*:*",
                    },
                  ],
                },
                {
                  Effect: "Allow",
                  Action: ["logs:PutLogEvents"],
                  Resource: [
                    {
                      "Fn::Sub":
                        "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/aws-node-sqs-worker-project-dev*:*:*",
                    },
                  ],
                },
                {
                  Effect: "Allow",
                  Action: ["sqs:SendMessage", "sqs:ChangeMessageVisibility"],
                  Resource: [
                    {
                      "Fn::GetAtt": ["my_jobs_queue", "Arn"],
                    },
                  ],
                },
                {
                  Effect: "Allow",
                  Action: [
                    "sqs:ReceiveMessage",
                    "sqs:DeleteMessage",
                    "sqs:GetQueueAttributes",
                  ],
                  Resource: [
                    {
                      "Fn::GetAtt": ["my_jobs_queue", "Arn"],
                    },
                  ],
                },
              ],
            },
          },
        ],
        Path: "/",
        RoleName: {
          "Fn::Join": [
            "-",
            [
              "aws-node-sqs-worker-project",
              "dev",
              {
                Ref: "AWS::Region",
              },
              "lambdaRole",
            ],
          ],
        },
      },
    },
    ProducerLambdaFunction: {
      Type: "AWS::Lambda::Function",
      Properties: {
        Code: {
          S3Bucket: {
            Ref: "ServerlessDeploymentBucket",
          },
          S3Key:
            "serverless/aws-node-sqs-worker-project/dev/1705833879496-2024-01-21T10:44:39.496Z/aws-node-sqs-worker-project.zip",
        },
        Handler: "index.producer",
        Runtime: "nodejs18.x",
        FunctionName: "aws-node-sqs-worker-project-dev-producer",
        MemorySize: 1024,
        Timeout: 6,
        Environment: {
          Variables: {
            QUEUE_URL: {
              Ref: "my_jobs_queue",
            },
          },
        },
        Role: {
          "Fn::GetAtt": ["IamRoleLambdaExecution", "Arn"],
        },
      },
      DependsOn: ["ProducerLogGroup"],
    },
    JobsWorkerLambdaFunction: {
      Type: "AWS::Lambda::Function",
      Properties: {
        Code: {
          S3Bucket: {
            Ref: "ServerlessDeploymentBucket",
          },
          S3Key:
            "serverless/aws-node-sqs-worker-project/dev/1705833879496-2024-01-21T10:44:39.496Z/aws-node-sqs-worker-project.zip",
        },
        Handler: "index.consumer",
        Runtime: "nodejs18.x",
        FunctionName: "my_worker_function",
        MemorySize: 1024,
        Timeout: 6,
        Role: {
          "Fn::GetAtt": ["IamRoleLambdaExecution", "Arn"],
        },
        ReservedConcurrentExecutions: 200,
      },
      DependsOn: ["JobsWorkerLogGroup"],
    },
    ProducerLambdaVersionuTQ7t4amwQGQCm6r1nMXU48wnVVaGIpkfkz7ZdThFp0: {
      Type: "AWS::Lambda::Version",
      DeletionPolicy: "Retain",
      Properties: {
        FunctionName: {
          Ref: "ProducerLambdaFunction",
        },
        CodeSha256: "AnrSvCAIoAKh7dIyDh8TyJ5Jbrqhyd8KoY1zzxb7XCM=",
      },
    },
    JobsWorkerLambdaVersionx1AYxWc2gFMOTQcCDa9Z0cA1wcVonrxuYZMubQpE: {
      Type: "AWS::Lambda::Version",
      DeletionPolicy: "Retain",
      Properties: {
        FunctionName: {
          Ref: "JobsWorkerLambdaFunction",
        },
        CodeSha256: "AnrSvCAIoAKh7dIyDh8TyJ5Jbrqhyd8KoY1zzxb7XCM=",
      },
    },
    JobsWorkerEventSourceMappingSQSmy_jobs_queue: {
      Type: "AWS::Lambda::EventSourceMapping",
      DependsOn: ["IamRoleLambdaExecution"],
      Properties: {
        BatchSize: 5,
        MaximumBatchingWindowInSeconds: 33,
        EventSourceArn: {
          "Fn::GetAtt": ["my_jobs_queue", "Arn"],
        },
        FunctionName: {
          "Fn::GetAtt": ["JobsWorkerLambdaFunction", "Arn"],
        },
        Enabled: false,
        FunctionResponseTypes: ["ReportBatchItemFailures"],
        ScalingConfig: {
          MaximumConcurrency: 1000,
        },
      },
    },
    HttpApi: {
      Type: "AWS::ApiGatewayV2::Api",
      Properties: {
        Name: "dev-aws-node-sqs-worker-project",
        ProtocolType: "HTTP",
      },
    },
    HttpApiStage: {
      Type: "AWS::ApiGatewayV2::Stage",
      Properties: {
        ApiId: {
          Ref: "HttpApi",
        },
        StageName: "$default",
        AutoDeploy: true,
        DefaultRouteSettings: {
          DetailedMetricsEnabled: false,
        },
      },
    },
    ProducerLambdaPermissionHttpApi: {
      Type: "AWS::Lambda::Permission",
      Properties: {
        FunctionName: {
          "Fn::GetAtt": ["ProducerLambdaFunction", "Arn"],
        },
        Action: "lambda:InvokeFunction",
        Principal: "apigateway.amazonaws.com",
        SourceArn: {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                Ref: "AWS::Partition",
              },
              ":execute-api:",
              {
                Ref: "AWS::Region",
              },
              ":",
              {
                Ref: "AWS::AccountId",
              },
              ":",
              {
                Ref: "HttpApi",
              },
              "/*",
            ],
          ],
        },
      },
    },
    HttpApiIntegrationProducer: {
      Type: "AWS::ApiGatewayV2::Integration",
      Properties: {
        ApiId: {
          Ref: "HttpApi",
        },
        IntegrationType: "AWS_PROXY",
        IntegrationUri: {
          "Fn::GetAtt": ["ProducerLambdaFunction", "Arn"],
        },
        PayloadFormatVersion: "2.0",
        TimeoutInMillis: 30000,
      },
    },
    HttpApiRoutePostProduce: {
      Type: "AWS::ApiGatewayV2::Route",
      Properties: {
        ApiId: {
          Ref: "HttpApi",
        },
        RouteKey: "POST /produce",
        Target: {
          "Fn::Join": [
            "/",
            [
              "integrations",
              {
                Ref: "HttpApiIntegrationProducer",
              },
            ],
          ],
        },
      },
      DependsOn: "HttpApiIntegrationProducer",
    },
    my_jobs_dlq: {
      Type: "AWS::SQS::Queue",
      Properties: {
        MessageRetentionPeriod: 1209600,
        QueueName: "my_worker_queue-dlq",
      },
      UpdateReplacePolicy: "Delete",
      DeletionPolicy: "Delete",
    },
    my_jobs_queue: {
      Type: "AWS::SQS::Queue",
      Properties: {
        DelaySeconds: 60,
        QueueName: "my_worker_queue",
        RedrivePolicy: {
          deadLetterTargetArn: {
            "Fn::GetAtt": ["my_jobs_dlq", "Arn"],
          },
          maxReceiveCount: 1,
        },
        VisibilityTimeout: 1,
      },
      UpdateReplacePolicy: "Delete",
      DeletionPolicy: "Delete",
    },
  },
  Outputs: {
    ServerlessDeploymentBucketName: {
      Value: {
        Ref: "ServerlessDeploymentBucket",
      },
      Export: {
        Name: "sls-aws-node-sqs-worker-project-dev-ServerlessDeploymentBucketName",
      },
    },
    ProducerLambdaFunctionQualifiedArn: {
      Description: "Current Lambda function version",
      Value: {
        Ref: "ProducerLambdaVersionuTQ7t4amwQGQCm6r1nMXU48wnVVaGIpkfkz7ZdThFp0",
      },
      Export: {
        Name: "sls-aws-node-sqs-worker-project-dev-ProducerLambdaFunctionQualifiedArn",
      },
    },
    JobsWorkerLambdaFunctionQualifiedArn: {
      Description: "Current Lambda function version",
      Value: {
        Ref: "JobsWorkerLambdaVersionx1AYxWc2gFMOTQcCDa9Z0cA1wcVonrxuYZMubQpE",
      },
      Export: {
        Name: "sls-my_worker_functionLambdaFunctionQualifiedArn",
      },
    },
    HttpApiId: {
      Description: "Id of the HTTP API",
      Value: {
        Ref: "HttpApi",
      },
      Export: {
        Name: "sls-aws-node-sqs-worker-project-dev-HttpApiId",
      },
    },
    HttpApiUrl: {
      Description: "URL of the HTTP API",
      Value: {
        "Fn::Join": [
          "",
          [
            "https://",
            {
              Ref: "HttpApi",
            },
            ".execute-api.",
            {
              Ref: "AWS::Region",
            },
            ".",
            {
              Ref: "AWS::URLSuffix",
            },
          ],
        ],
      },
      Export: {
        Name: "sls-aws-node-sqs-worker-project-dev-HttpApiUrl",
      },
    },
    jobsQueueArnA5A2FF7E: {
      Description: 'ARN of the "jobs" SQS queue.',
      Value: {
        "Fn::GetAtt": ["my_jobs_queue", "Arn"],
      },
    },
    jobsQueueUrl573F5B7A: {
      Description: 'URL of the "jobs" SQS queue.',
      Value: {
        Ref: "my_jobs_queue",
      },
    },
    jobsDlqUrl2C7FA9D4: {
      Description: 'URL of the "jobs" SQS dead letter queue.',
      Value: {
        Ref: "my_jobs_dlq",
      },
    },
  },
};
