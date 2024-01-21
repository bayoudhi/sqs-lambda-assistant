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
