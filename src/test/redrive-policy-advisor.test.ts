import { Worker } from "../core";
import { VisibilityTimeoutAdvisor } from "../core/visibility-timeout-advisor";

describe("App", () => {
  it("should contain suggestion 'Consider specifying RedrivePolicy to use a dead letter queue' when no RedrivePolicy present in SQS", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 1,
          ScalingConfig: { MaximumConcurrency: 1 },
        },
      },
    });
    expect(new VisibilityTimeoutAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "SQS VisibilityTimeout must be greater than Lambda Timeout * 6",
      ]),
    );
  });
  it("should contain suggestion 'The deadLetterTargetArn must be present in RedrivePolicy' when no deadLetterTargetArn property in RedrivePolicy present in SQS", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: {
        id: "sqs",
        Properties: { VisibilityTimeout: 6, RedrivePolicy: {} },
      },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 1,
          ScalingConfig: { MaximumConcurrency: 1 },
        },
      },
    });
    expect(new VisibilityTimeoutAdvisor().apply(worker)).toHaveLength(0);
  });
  it("should contain suggestion 'Consider increasing maxReceiveCount' when maxReceiveCount is less than 3", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: {
        id: "sqs",
        Properties: {
          VisibilityTimeout: 7,
          RedrivePolicy: {
            deadLetterTargetArn: "my-dead-letter-queue",
            maxReceiveCount: 1,
          },
        },
      },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 1,
          ScalingConfig: { MaximumConcurrency: 1 },
        },
      },
    });
    expect(new VisibilityTimeoutAdvisor().apply(worker)).toHaveLength(0);
  });
});
