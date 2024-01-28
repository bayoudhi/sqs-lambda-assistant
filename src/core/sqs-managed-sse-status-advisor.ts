import { Advisor } from "./types";
import { Worker } from "./worker";

export class SqsManagedSseStatusAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    if (worker.sqs.Properties.SqsManagedSseEnabled === false) {
      suggestions.push(
        "Server-side queue encryption is disabled, consider enabling it or use your own encryption service",
      );
    }
    return suggestions;
  }
}
