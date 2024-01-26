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

  analyze() {
    const suggestions = [];
    if (
      this.integration.Properties.ScalingConfig?.MaximumConcurrency ===
      undefined
    ) {
      suggestions.push(
        `Messages production rate should be less than ${
          Number(this.integration.Properties.BatchSize) /
          Number(this.lambda.Properties.Timeout)
        } message(s) per seconds * executions count`,
      );
      suggestions.push("Specify MaximumConcurrency to prevent throttle");
    } else {
      suggestions.push(
        `Messages production rate should be less than ${
          Number(this.integration.Properties.ScalingConfig.MaximumConcurrency) *
          (Number(this.integration.Properties.BatchSize) /
            Number(this.lambda.Properties.Timeout))
        } message(s) per seconds`,
      );
    }
    return suggestions;
  }
}
