import { Worker } from "../core";
import { MaximumBatchingWindowsAdvisor } from "../core/maximum-batching-window-advisor";

describe("App", () => {
  it("should not contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has no properties", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {},
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has no batch size", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          EventSourceArn: "my-arn", // random property
        },
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has batch size less than 11", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 6,
          EventSourceArn: "my-arn", // random property
        },
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has batch size greater than 11 and no MaximumBatchingWindowInSeconds specified", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 11,
          EventSourceArn: "my-arn", // random property
        },
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10",
      ]),
    );
  });
  it("should contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has batch size greater than 11 and MaximumBatchingWindowInSeconds set to 0", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 11,
          MaximumBatchingWindowInSeconds: 0,
          EventSourceArn: "my-arn", // random property
        },
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10",
      ]),
    );
  });
  it("should not contain suggestion 'MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10' when integration has batch size greater than 11 and MaximumBatchingWindowInSeconds greater or equals to 1", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 11,
          MaximumBatchingWindowInSeconds: 1,
          EventSourceArn: "my-arn", // random property
        },
      },
    });
    expect(new MaximumBatchingWindowsAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
});
