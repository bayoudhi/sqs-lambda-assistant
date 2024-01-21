import { Lambda, SQS } from 'cloudform-types';

interface IWorker {
  id: string;
  lambda: Lambda.Function;
  integration: Lambda.EventSourceMapping;
  sqs: SQS.Queue;
  analyze: () => string[];
}

type WorkerOptions = {
  id: string;
  lambda: Lambda.Function;
  integration: Lambda.EventSourceMapping;
  sqs: SQS.Queue;
};

export default class Worker implements IWorker {
  id: string;
  lambda: Lambda.Function;
  integration: Lambda.EventSourceMapping;
  sqs: SQS.Queue;

  constructor(options: WorkerOptions) {
    this.id = options.id;
    this.lambda = options.lambda;
    this.integration = options.integration;
    this.sqs = options.sqs;
  }

  analyze() {
    return [];
  }
}
