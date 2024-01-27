import { Worker } from "../core";
import { SqsManagedSseStatusAdvisor } from "../core/sqs-managed-sse-status-advisor";

describe("App", () => {
  it("should not contain suggestion 'Server-side queue encryption is disabled, consider enabling it or use your own encryption service' when queue has no properties", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {},
      },
    });
    expect(new SqsManagedSseStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'Server-side queue encryption is disabled, consider enabling it or use your own encryption service' when queue properties has no 'SqsManagedSseEnabled' property", () => {
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
    expect(new SqsManagedSseStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'Server-side queue encryption is disabled, consider enabling it or use your own encryption service' when queue properties has 'SqsManagedSseEnabled' property set to 'false'", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: {
        id: "sqs",
        Properties: { VisibilityTimeout: 1, SqsManagedSseEnabled: false },
      },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 1,
          ScalingConfig: { MaximumConcurrency: 1 },
        },
      },
    });
    expect(new SqsManagedSseStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([
        "Server-side queue encryption is disabled, consider enabling it or use your own encryption service",
      ]),
    );
  });
});
