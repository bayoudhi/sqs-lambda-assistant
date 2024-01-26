import { yamlParse, yamlDump } from "yaml-cfn";

describe("Convert CloudFormation template from YAML to JSON", () => {
  const input = `
    Key:
      - !GetAtt Foo.Bar
      - !Equals [!Ref Baz, "hello"]
    `;

  const parsed = {
    Key: [
      { "Fn::GetAtt": ["Foo", "Bar"] },
      { "Fn::Equals": [{ Ref: "Baz" }, "hello"] },
    ],
  };
  it("should convert a CloudFormation template from YAML to JSON", () => {
    expect(yamlParse(input)).toEqual(parsed);
    expect(yamlParse(yamlDump(parsed))).toEqual(parsed);
  });
});
