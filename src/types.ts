import { Lambda as CFLambda, SQS as CFSQS } from "cloudform-types";

export type Integration = Omit<
  Partial<CFLambda.EventSourceMapping>,
  "Properties"
> & {
  Properties: Partial<CFLambda.EventSourceMapping["Properties"]>;
} & {
  id: string;
};

export type Lambda = Omit<Partial<CFLambda.Function>, "Properties"> & {
  Properties: Partial<CFLambda.Function["Properties"]>;
} & {
  id: string;
};

export type SQS = Pick<CFSQS.Queue, "Properties"> & { id: string };
