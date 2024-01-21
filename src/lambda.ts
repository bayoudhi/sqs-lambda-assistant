import { Lambda as CFLambda } from "cloudform-types";

export type LambdaOptions = Pick<
  Omit<CFLambda.Function, "Properties"> & {
    id: string;
    Properties: Omit<CFLambda.Function["Properties"], "Code" | "Role">;
  },
  "id" | "Properties"
>;

export default class Lambda {
  id: string;
  Properties: LambdaOptions["Properties"];

  constructor(options: LambdaOptions) {
    this.id = options.id;
    this.Properties = options.Properties;
  }

  toString(): string {
    return this.Properties.toString();
  }
}
