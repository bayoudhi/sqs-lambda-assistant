import { Template } from "cloudform-types";

export type CFTemplateType =
  | "AWS::SQS::Queue"
  | "AWS::Lambda::Function"
  | "AWS::Lambda::EventSourceMapping";

export const extract = (template: Template, type: CFTemplateType) => {
  if (template.Resources) {
    const resources = template.Resources;
    if (resources && Object.keys(resources).length > 0) {
      return Object.keys(resources)
        .filter((key) => resources[key].Type === type)
        .map((key) => ({
          LogicalId: key,
          Properties: resources[key].Properties,
        }));
    }
  }
  return [];
};
