import { Worker } from "../core";
import { MessageRetentionPeriodAdvisor } from "../core/message-retention-period-advisor";

describe("App", () => {
  it("should not contain suggestion 'Consider increasing MessageRetentionPeriod to 4 days (345600 seconds) or 7 days (604800 seconds)' when SQS MessageRetentionPeriod property is not specified", () => {
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
    expect(new MessageRetentionPeriodAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should contain suggestion 'Consider increasing MessageRetentionPeriod to 4 days (345600 seconds) or 7 days (604800 seconds)' when SQS MessageRetentionPeriod property is less than 4 days (345600 seconds)", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: {
        id: "sqs",
        Properties: {
          VisibilityTimeout: 1,
          MessageRetentionPeriod: 345600 - 1,
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
    expect(new MessageRetentionPeriodAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "Consider increasing MessageRetentionPeriod to 4 days (345600 seconds) or 7 days (604800 seconds)",
      ]),
    );
  });
  it("should not contain suggestion 'Consider increasing MessageRetentionPeriod to 4 days (345600 seconds) or 7 days (604800 seconds)' when SQS MessageRetentionPeriod property is less than 4 days (345600 seconds)", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: {
        id: "sqs",
        Properties: {
          VisibilityTimeout: 1,
          MessageRetentionPeriod: 345600 + 1,
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
    expect(new MessageRetentionPeriodAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
});
