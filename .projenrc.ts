import { web } from "projen";
const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: "main",
  name: "foo",
  projenrcTs: true,

  deps: [
    "react-pure-modal",
    "@uiw/react-textarea-code-editor",
    "yaml-cfn",
    "cloudform-types",
  ],
  /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    "@babel/plugin-proposal-private-property-in-object",
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  prettier: true,
  prettierOptions: {
    settings: { singleQuote: false },
  },
});
project.synth();
