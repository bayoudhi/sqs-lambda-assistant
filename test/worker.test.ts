import Integration from '../src/integration';
import Lambda from '../src/lambda';
import SQS from '../src/sqs';
import Worker from '../src/worker';

it('should instantiate a lambda correctly', () => {
  const lambda = new Lambda({ id: 'lambda', Properties: { Timeout: 3 } });
  expect(lambda.id).toBe('lambda');
  expect(lambda.Properties.Timeout).toBe(3);
});

it('should instantiate a sqs correctly', () => {
  const sqs = new SQS({ id: 'sqs', Properties: { VisibilityTimeout: 30 } });
  expect(sqs.id).toBe('sqs');
  expect(sqs.Properties.VisibilityTimeout).toBe(30);
});

it('should instantiate an integration correctly', () => {
  const integration = new Integration({ id: 'integration', Properties: { BatchSize: 10 } });
  expect(integration.id).toBe('integration');
  expect(integration.Properties.BatchSize).toBe(10);
});


it('should instantiate a worker correctly', () => {
  const lambda = new Lambda({ id: 'lambda', Properties: { Timeout: 3 } });
  const sqs = new SQS({ id: 'sqs', Properties: { VisibilityTimeout: 30 } });
  const integration = new Integration({ id: 'integration', Properties: { BatchSize: 10 } });
  const worker = new Worker({ id: 'worker', lambda, sqs, integration });
  expect(worker.id).toBe('worker');
  expect(worker.lambda.id).toBe('lambda');
  expect(worker.lambda.Properties.Timeout).toBe(3);
  expect(worker.sqs.id).toBe('sqs');
  expect(worker.sqs.Properties.VisibilityTimeout).toBe(30);
  expect(worker.integration.id).toBe('integration');
  expect(worker.integration.Properties.BatchSize).toBe(10);
});