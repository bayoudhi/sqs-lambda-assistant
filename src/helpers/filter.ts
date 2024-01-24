import { Template, Lambda, SQS } from "cloudform-types";
import { extract } from "./cf-extractor";

export const filter = (template: Template) => {
  const queues = extract<SQS.Queue["Properties"]>(template, "AWS::SQS::Queue");
  const functions = extract<Lambda.Function["Properties"]>(
    template,
    "AWS::Lambda::Function",
  );
  const integrations = extract<Lambda.EventSourceMapping["Properties"]>(
    template,
    "AWS::Lambda::EventSourceMapping",
  );
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
          //@ts-ignore
          (eventSourceArn && eventSourceArn["Fn::GetAtt"]) ||
          //@ts-ignore
          eventSourceArn.Ref
        ) {
          //@ts-ignore
          let logicalId = eventSourceArn.Ref;
          //@ts-ignore
          if (eventSourceArn["Fn::GetAtt"]) {
            //@ts-ignore
            logicalId = eventSourceArn["Fn::GetAtt"][0];
          }
          const sqs = queues.find(({ LogicalId }) => LogicalId === logicalId);
          const lambda = functions.find(
            ({ LogicalId }) =>
              //@ts-ignore
              LogicalId === integration.Properties.FunctionName?.Ref ||
              LogicalId ===
                //@ts-ignore
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
