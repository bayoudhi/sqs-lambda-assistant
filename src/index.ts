import { Integration, Lambda, SQS } from "./types";
import Worker from "./worker";

export class Hello {
  public sayHello() {
    return "hello, world!";
  }
}

const lambda: Lambda = {
  id: "lambda",
  Properties: {
    ReservedConcurrentExecutions: 3,
  },
};

const sqs: SQS = {
  id: "sqs",
  Properties: {},
};

const integration: Integration = {
  id: "integration",
  Properties: {
    BatchSize: 12,
  },
};

const w = new Worker({
  id: "worker",
  integration,
  lambda,
  sqs,
});

w.analyze();
