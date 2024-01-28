import { Advisor } from "./types";
import { Worker } from "./worker";

export class MessageRetentionPeriodAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    const messageRetentionPeriod = Number(
      worker.sqs.Properties.MessageRetentionPeriod,
    );
    const day = 86400; // 1 day in seconds
    if (messageRetentionPeriod < day * 4) {
      suggestions.push(
        "Consider increasing MessageRetentionPeriod to 4 days (345600 seconds) or 7 days (604800 seconds)",
      );
    }
    return suggestions;
  }
}
