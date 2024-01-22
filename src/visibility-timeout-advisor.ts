import { Advisor } from "./types";
import { Worker } from "./worker";

export class VisibilityTimeoutAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    const visibilityTimeout = Number(worker.sqs.Properties.VisibilityTimeout);
    const timeout = Number(worker.lambda.Properties.Timeout);
    if (visibilityTimeout < timeout * 6) {
      suggestions.push(
        "visibilityTimeout must be greater than lambda.visibilityTimeout * 6",
      );
    }
    return suggestions;
  }
}
