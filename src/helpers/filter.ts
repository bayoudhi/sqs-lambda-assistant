// @ts-nocheck
import { Template, Lambda, SQS } from "cloudform-types";
import { extract } from "./cf-extractor";

export const filter = (template: Template) => {
  const queues = extract(template, "AWS::SQS::Queue") as Partial<SQS.Queue>[];
  const functions = extract(
    template,
    "AWS::Lambda::Function",
  ) as Partial<Lambda.Function>[];
  const integrations = extract(
    template,
    "AWS::Lambda::EventSourceMapping",
  ) as Partial<Lambda.EventSourceMapping>[];
  const filtered: Record<
    string,
    | Partial<SQS.Queue>
    | Partial<Lambda.Function>
    | Partial<Lambda.EventSourceMapping>
  >[] = [];
  if (queues.length > 0 && functions.length > 0 && integrations.length > 0) {
    integrations.forEach((integration) => {
      if (
        integration &&
        integration.Properties &&
        integration.Properties.EventSourceArn &&
        integration.Properties.FunctionName
      ) {
        const eventSourceArn = integration.Properties.EventSourceArn;
        if (
          (eventSourceArn && eventSourceArn["Fn::GetAtt"]) ||
          eventSourceArn.Ref
        ) {
          let logicalId = eventSourceArn.Ref;
          if (eventSourceArn["Fn::GetAtt"]) {
            logicalId = eventSourceArn["Fn::GetAtt"][0];
          }
          const sqs = queues.find(({ LogicalId }) => LogicalId === logicalId);
          const lambda = functions.find(
            ({ LogicalId }) =>
              LogicalId === integration.Properties.FunctionName?.Ref ||
              LogicalId ===
                integration.Properties.FunctionName?.["Fn::GetAtt"]?.[0],
          );
          if (sqs && lambda) {
            filtered.push({ integration, lambda, sqs });
          }
        }
      }
    });
  }
  return filtered;
};
