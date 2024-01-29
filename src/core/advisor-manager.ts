import { Advisor } from "./types";
import { Worker } from "./worker";

export class AdvisorManager {
  advisors: Array<Advisor> = [];

  constructor(advisors: Array<Advisor>) {
    this.advisors = advisors;
  }

  analyze(worker: Worker): string[] {
    return this.advisors.map((advisor) => advisor.apply(worker)).flat();
  }
}
