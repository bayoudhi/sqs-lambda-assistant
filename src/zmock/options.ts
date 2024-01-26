/* eslint quote-props: 0 */
/* eslint quotes: 0 */
/* eslint comma-dangle: 0 */
/* eslint semi: 0 */
export const OPTIONS: {}[] = [
  {
    id: "foo",
    integration: {
      LogicalId: "JobsWorkerEventSourceMappingSQSJobsQueueCEDBAE3E",
      Properties: {
        BatchSize: 5,
        MaximumBatchingWindowInSeconds: 33,
        EventSourceArn: {
          "Fn::GetAtt": ["jobsQueueCEDBAE3E", "Arn"],
        },
        FunctionName: {
          "Fn::GetAtt": ["JobsWorkerLambdaFunction", "Arn"],
        },
        Enabled: true,
        FunctionResponseTypes: ["ReportBatchItemFailures"],
        ScalingConfig: {
          MaximumConcurrency: 1000,
        },
      },
    },
    lambda: {
      LogicalId: "JobsWorkerLambdaFunction",
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
        FunctionName: "aws-node-sqs-worker-project-dev-jobsWorker",
        MemorySize: 1024,
        Timeout: 6,
        Role: {
          "Fn::GetAtt": ["IamRoleLambdaExecution", "Arn"],
        },
        ReservedConcurrentExecutions: 200,
      },
    },
    sqs: {
      LogicalId: "jobsQueueCEDBAE3E",
      Properties: {
        DelaySeconds: 60,
        QueueName: "aws-node-sqs-worker-project-dev-jobs",
        RedrivePolicy: {
          deadLetterTargetArn: {
            "Fn::GetAtt": ["jobsDlqD18CF374", "Arn"],
          },
          maxReceiveCount: 3,
        },
        VisibilityTimeout: 69,
      },
    },
    suggestions: [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },
  {
    integration: {
      LogicalId: "EventSourceMapping1",
      Properties: {
        BatchSize: 50,
        EventSourceArn: {
          "Fn::GetAtt": ["SQSQueue1", "Arn"],
        },
        FunctionName: {
          Ref: "LambdaFunction1",
        },
      },
    },
    lambda: {
      LogicalId: "LambdaFunction1",
      Properties: {
        Handler: "index.handler",
        Role: "arn:aws:iam::123456789012:role/lambda-role",
        FunctionName: "LambdaFunction1",
        Runtime: "nodejs14.x",
        Code: {
          S3Bucket: "lambda-code-bucket",
          S3Key: "lambda-code1.zip",
        },
        Environment: {
          Variables: {
            QUEUE_URL: {
              Ref: "SQSQueue1",
            },
          },
        },
      },
    },
    sqs: {
      LogicalId: "SQSQueue1",
    },
  },
  {
    integration: {
      LogicalId: "EventSourceMapping2",
      Properties: {
        BatchSize: 5,
        EventSourceArn: {
          "Fn::GetAtt": ["SQSQueue2", "Arn"],
        },
        FunctionName: {
          Ref: "LambdaFunction2",
        },
      },
    },
    lambda: {
      LogicalId: "LambdaFunction2",
      Properties: {
        Handler: "index.handler",
        Role: "arn:aws:iam::123456789012:role/lambda-role",
        FunctionName: "LambdaFunction2",
        Runtime: "nodejs14.x",
        Code: {
          S3Bucket: "lambda-code-bucket",
          S3Key: "lambda-code2.zip",
        },
        Environment: {
          Variables: {
            QUEUE_URL: {
              Ref: "SQSQueue2",
            },
          },
        },
      },
    },
    sqs: {
      LogicalId: "SQSQueue2",
    },
  },
];
