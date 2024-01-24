import { Worker } from "../src/worker";

it("should instantiate a worker correctly", () => {
  const worker = new Worker({
    id: "worker",
    lambda: { id: "lambda", Properties: { Timeout: 3 } },
    sqs: { id: "sqs", Properties: { VisibilityTimeout: 30 } },
    integration: {
      id: "integration",
      Properties: { BatchSize: 10 },
    },
  });
  expect(worker.id).toBe("worker");
  expect(worker.lambda.id).toBe("lambda");
  expect(worker.lambda.Properties.Timeout).toBe(3);
  expect(worker.sqs.id).toBe("sqs");
  expect(worker.sqs.Properties.VisibilityTimeout).toBe(30);
  expect(worker.integration.id).toBe("integration");
  expect(worker.integration.Properties.BatchSize).toBe(10);
});

describe("worker with different options", () => {
  const analyze = (
    Timeout: number,
    BatchSize: number,
    MaximumConcurrency?: number,
  ) =>
    new Worker({
      id: "worker",
      lambda: { id: "lambda", Properties: { Timeout } },
      sqs: { id: "sqs", Properties: {} },
      integration: {
        id: "integration",
        Properties: { BatchSize, ScalingConfig: { MaximumConcurrency } },
      },
    }).analyze();

  // analyze(Timeout, BatchSize, MaxConcurrency)
  describe("when MaximumConcurrency is undefined", () => {
    it("should satisfy the options", () => {
      expect(analyze(1, 1)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 1 message(s) per seconds * executions count",
          "Specify MaximumConcurrency to prevent throttle",
        ]),
      );
      expect(analyze(10, 1)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 0.1 message(s) per seconds * executions count",
          "Specify MaximumConcurrency to prevent throttle",
        ]),
      );
      expect(analyze(1, 10)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 10 message(s) per seconds * executions count",
          "Specify MaximumConcurrency to prevent throttle",
        ]),
      );
    });
  });
  describe("when MaximumConcurrency is a positive number greater or equal than 2", () => {
    it("should satisfy the options", () => {
      expect(analyze(1, 1, 2)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 2 message(s) per seconds",
        ]),
      );
      expect(analyze(10, 1, 2)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 0.2 message(s) per seconds",
        ]),
      );
      expect(analyze(1, 10, 2)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 20 message(s) per seconds",
        ]),
      );
      expect(analyze(10, 1, 10)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 1 message(s) per seconds",
        ]),
      );
      expect(analyze(1, 10, 10)).toEqual(
        expect.arrayContaining([
          "Messages production rate should be less than 100 message(s) per seconds",
        ]),
      );
    });
  });
});
