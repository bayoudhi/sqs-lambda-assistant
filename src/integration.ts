import { Lambda as CFLambda } from "cloudform-types";

export type IntegrationOptions = Pick<
  Omit<CFLambda.EventSourceMapping, "Properties"> & {
    id: string;
    Properties: Omit<CFLambda.EventSourceMapping["Properties"], "FunctionName">;
  },
  "id" | "Properties"
>;

export default class Integration {
  id: string;
  Properties: IntegrationOptions["Properties"];

  constructor(options: IntegrationOptions) {
    this.id = options.id;
    this.Properties = options.Properties;
  }

  toString(): string {
    return this.Properties.toString();
  }
}
