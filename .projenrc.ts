import { typescript } from 'projen';
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'sqs-lambda-assistant',
  projenrcTs: true,

  deps: ['cloudform-types'], /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  tsconfig: {
    compilerOptions: {
      skipLibCheck: true,
    },
  },
});
project.synth();