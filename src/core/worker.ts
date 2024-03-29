import { Integration, Lambda, SQS } from "./types";

export type WorkerOptions = {
  id: string;
  lambda: Lambda;
  integration: Integration;
  sqs: SQS;
};

export class Worker {
  readonly id: string;
  readonly lambda: Lambda;
  readonly integration: Integration;
  readonly sqs: SQS;

  constructor(options: WorkerOptions) {
    this.id = options.id;
    this.lambda = options.lambda;
    this.integration = options.integration;
    this.sqs = options.sqs;
  }
}
