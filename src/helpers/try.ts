import { extract } from "./cf-extractor";
import { filter } from "./filter";

const fs = require("fs");

const run = () => {
  fs.writeFileSync("b.json", "");
  for (let index = 7; index <= 7; index++) {
    const path = `./mock/template${index}.json`;
    const template = JSON.parse(fs.readFileSync(path));
    const options = filter(template);
    if (options.length > 0) {
      fs.appendFileSync("b.json", `\n --- Options of ${index} --- \n`);
      fs.appendFileSync('b.json', JSON.stringify(options, null, 2));
    }
  }
};
const run2 = () => {
  fs.writeFileSync("a.json", "");
  for (let index = 7; index <= 7; index++) {
    const path = `./mock/template${index}.json`;
    const template = JSON.parse(fs.readFileSync(path));
    const sqs = extract(template, "AWS::SQS::Queue");
    const lambdas = extract(template, "AWS::Lambda::Function");
    const mappings = extract(template, "AWS::Lambda::EventSourceMapping");
    if (sqs.length > 0 && lambdas.length > 0 && mappings.length > 0) {
      fs.appendFileSync(
        "a.json",
        `\n############### - ${index} - ################\n`,
      );
      fs.appendFileSync("a.json", `\n --- SQSs of ${index} --- \n`);
      fs.appendFileSync("a.json", JSON.stringify(sqs, null, 2));
      fs.appendFileSync("a.json", `\n --- Lambdas of ${index}  --- \n`);
      fs.appendFileSync("a.json", JSON.stringify(lambdas, null, 2));
      fs.appendFileSync(
        "a.json",
        `\n --- EventSourceMappings of ${index}  --- \n`,
      );
      fs.appendFileSync("a.json", JSON.stringify(mappings, null, 2));
    }
  }
  console.log("Done");
};

run();
run2();
