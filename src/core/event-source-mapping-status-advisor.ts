import { Advisor } from "./types";
import { Worker } from "./worker";

export class EventSourceMappingStatusAdvisor implements Advisor {
  apply(worker: Worker) {
    const suggestions: string[] = [];
    if (worker.integration.Properties.Enabled === false) {
      suggestions.push("Event Source Mapping should be enabled");
    }
    return suggestions;
  }
}
