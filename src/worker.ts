import { IntegrationOptions } from "./integration";
import { LambdaOptions } from "./lambda";
import { SQSOptions } from "./sqs";

interface IWorker {
  id: string;
  lambda: LambdaOptions;
  integration: IntegrationOptions;
  sqs: SQSOptions;
  analyze: () => string[];
}

export type WorkerOptions = {
  id: string;
  lambda: LambdaOptions;
  integration: IntegrationOptions;
  sqs: SQSOptions;
};

export default class Worker implements IWorker {
  id: string;
  lambda: LambdaOptions;
  integration: IntegrationOptions;
  sqs: SQSOptions;

  constructor(options: WorkerOptions) {
    this.id = options.id;
    this.lambda = options.lambda;
    this.integration = options.integration;
    this.sqs = options.sqs;
  }

  analyze() {
    console.log(this.id);
    console.log(this.lambda);
    console.log(this.integration);
    console.log(this.sqs);
    return [];
  }
}
