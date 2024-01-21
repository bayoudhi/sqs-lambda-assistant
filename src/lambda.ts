import { Lambda as CFLambda } from 'cloudform-types';

export type LambdaOptions = Omit<Partial<CFLambda.Function>, 'Properties'> & {
  Properties: Partial<CFLambda.Function['Properties']>;
} & {
  id: string;
};

export default class Lambda {
  id: string;
  Properties: LambdaOptions['Properties'];

  constructor(options: LambdaOptions) {
    this.id = options.id;
    this.Properties = options.Properties;
  }

  toString(): string {
    return this.Properties.toString();
  }
}
