import { Advisor } from "./types";
import { Worker } from "./worker";

export class RedrivePolicyAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    if (worker.sqs.Properties.RedrivePolicy) {
      if (!worker.sqs.Properties.RedrivePolicy.deadLetterTargetArn) {
        suggestions.push(
          "The deadLetterTargetArn must be present in RedrivePolicy",
        );
      }
      if (Number(worker.sqs.Properties.RedrivePolicy.maxReceiveCount) < 2) {
        suggestions.push("Consider increasing maxReceiveCount");
      }
    } else {
      suggestions.push(
        "Consider specifying RedrivePolicy to use a dead letter queue",
      );
    }
    return suggestions;
  }
}
