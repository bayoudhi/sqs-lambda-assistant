import Integration from './integration';
import Lambda from './lambda';
import SQS from './sqs';
import Worker from './worker';

export class Hello {
  public sayHello() {
    return 'hello, world!';
  }
}

const lambda = new Lambda({
  id: 'lambda',
  Properties: {
    ReservedConcurrentExecutions: 3,
  },
});
const sqs = new SQS({
  id: 'sqs',
  Properties: {},
});
const integration = new Integration({
  id: 'integration',
  Properties: {
    BatchSize: 12,
  },
});
const w = new Worker({
  id: 'worker',
  integration,
  lambda,
  sqs,
});

w.analyze();