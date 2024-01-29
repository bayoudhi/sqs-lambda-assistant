import { AdvisorManager } from "./advisor-manager";
import { EventSourceMappingStatusAdvisor } from "./event-source-mapping-status-advisor";
import { MaximumBatchingWindowsAdvisor } from "./maximum-batching-window-advisor";
import { MessageRetentionPeriodAdvisor } from "./message-retention-period-advisor";
import { RedrivePolicyAdvisor } from "./redrive-policy-advisor";
import { VisibilityTimeoutAdvisor } from "./visibility-timeout-advisor";

export * from "./worker";

export const advisor = new AdvisorManager([
  new EventSourceMappingStatusAdvisor(),
  new MaximumBatchingWindowsAdvisor(),
  new MessageRetentionPeriodAdvisor(),
  new RedrivePolicyAdvisor(),
  new VisibilityTimeoutAdvisor(),
]);
