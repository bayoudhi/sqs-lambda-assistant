import { Worker } from "../core";
import { EventSourceMappingStatusAdvisor } from "../core/event-source-mapping-status-advisor";

describe("App", () => {
  it("should not contain suggestion 'Event Source Mapping should be enabled' when integration has no properties", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {},
      },
    });
    expect(new EventSourceMappingStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'Event Source Mapping should be enabled' when integration properties has no 'Enabled' property", () => {
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
    expect(new EventSourceMappingStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining([]),
    );
  });
  it("should not contain suggestion 'Event Source Mapping should be enabled' when integration properties has 'Enabled' property set to 'false'", () => {
    const worker = new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout: 1 } },
      sqs: { id: "sqs", Properties: { VisibilityTimeout: 1 } },
      integration: {
        id: "integration",
        Properties: {
          BatchSize: 1,
          ScalingConfig: { MaximumConcurrency: 1 },
          Enabled: false,
        },
      },
    });
    expect(new EventSourceMappingStatusAdvisor().apply(worker)).toEqual(
      expect.arrayContaining(["Event Source Mapping should be enabled"]),
    );
  });
});
