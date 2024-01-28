import { Worker } from "../core";
import { RedrivePolicyAdvisor } from "../core/redrive-policy-advisor";

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
    expect(new RedrivePolicyAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "Consider specifying RedrivePolicy to use a dead letter queue",
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
    expect(new RedrivePolicyAdvisor().apply(worker)).toHaveLength(1);
    expect(new RedrivePolicyAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "The deadLetterTargetArn must be present in RedrivePolicy",
      ]),
    );
  });
  it("should contain suggestion 'Consider increasing maxReceiveCount' when maxReceiveCount is less than 2", () => {
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
    expect(new RedrivePolicyAdvisor().apply(worker)).toHaveLength(1);
    expect(new RedrivePolicyAdvisor().apply(worker)).toEqual(
      expect.arrayContaining(["Consider increasing maxReceiveCount"]),
    );
  });
});
