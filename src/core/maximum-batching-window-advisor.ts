import { Advisor } from "./types";
import { Worker } from "./worker";

export class MaximumBatchingWindowsAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    const batchSize = Number(worker.integration.Properties.BatchSize);
    const maximumBatchingWindowInSeconds = Number(
      worker.integration.Properties.MaximumBatchingWindowInSeconds,
    );
    if (
      (batchSize > 10 && !maximumBatchingWindowInSeconds) ||
      (batchSize > 10 && maximumBatchingWindowInSeconds < 1)
    ) {
      suggestions.push(
        "MaximumBatchingWindowInSeconds must be set at least 1 when BatchSize is greater than 10",
      );
    }
    return suggestions;
  }
}
