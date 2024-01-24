import { VisibilityTimeoutAdvisor } from "../src/visibility-timeout-advisor";
import { Worker } from "../src/worker";

describe("App", () => {
  it("should contain suggestion 'SQS VisibilityTimeout must be greater than Lambda Timeout * 6'", () => {
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
  it("should not contain suggestion 'SQS VisibilityTimeout must be greater than Lambda Timeout * 6'", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 6 } },
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
  it("should not contain suggestion 'SQS VisibilityTimeout must be greater than Lambda Timeout * 6'", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 7 } },
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
