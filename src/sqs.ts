import { SQS as CFSQS } from "cloudform-types";

export type SQSOptions = Pick<CFSQS.Queue, "Properties"> & { id: string };

export default class SQS {
  id: string;
  Properties: SQSOptions["Properties"];

  constructor(options: SQSOptions) {
    this.id = options.id;
    this.Properties = options.Properties;
  }

  toString(): string {
    return this.Properties.toString();
  }
}
