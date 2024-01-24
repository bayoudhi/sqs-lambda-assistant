import { extract } from "../../src/helpers/cf-extractor";

describe(`when template does not contain any resource`, () => {
  const template = {
    Resources: {},
  };
  const type = "AWS::SQS::Queue";
  it(`should return an empty array`, () => {
    expect(extract(template, type)).toHaveLength(0);
  });
});
describe(`when template contains resources other that specified`, () => {
  const template = {
    Resources: {
      my_function: {
        Type: "AWS::Lambda::Function",
      },
      my_mapping: {
        Type: "AWS::Lambda::EventSourceMapping",
      },
    },
  };
  const type = "AWS::SQS::Queue";
  it(`should return an empty array`, () => {
    expect(extract(template, type)).toHaveLength(0);
  });
});
describe(`when template contains an SQS Queue resource and its corresponding type specified`, () => {
  describe("when SQS does not contain any properties", () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
        },
      },
    };
    const type = "AWS::SQS::Queue";
    it(`should return an array containing an SQS Queue resource with undefined "Properties"`, () => {
      expect(extract(template, type)).toHaveLength(1);
      expect(extract(template, type)).toEqual(
        expect.arrayContaining([
          { LogicalId: "my_queue", Properties: undefined },
        ]),
      );
    });
  });
  describe("when SQS contains properties as an empty object", () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
          Properties: {},
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
        },
      },
    };
    const type = "AWS::SQS::Queue";
    it(`should return an array containing an SQS Queue resource with "Properties" as an empty object`, () => {
      expect(extract(template, type)).toHaveLength(1);
      expect(extract(template, type)).toEqual(
        expect.arrayContaining([{ LogicalId: "my_queue", Properties: {} }]),
      );
    });
  });
  describe("when SQS contains properties", () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
          Properties: {
            foo: "bar",
            baz: {
              boo: "kaz",
              koo: 123,
            },
          },
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
        },
      },
    };
    const type = "AWS::SQS::Queue";
    it(`should return an array containing an SQS Queue resource having some "Properties"`, () => {
      expect(extract(template, type)).toHaveLength(1);
      expect(extract(template, type)).toEqual(
        expect.arrayContaining([
          {
            LogicalId: "my_queue",
            Properties: {
              foo: "bar",
              baz: {
                boo: "kaz",
                koo: 123,
              },
            },
          },
        ]),
      );
    });
  });
});
