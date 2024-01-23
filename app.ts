import { Lambda, SQS } from "cloudform-types";
import { extract } from "./src/helpers/cf-extractor";
import { filter } from "./src/helpers/filter";
import { Worker } from "./src/worker";

const fs = require("fs");

const run = () => {
  const workers: Worker[] = [];
  for (let index = 1; index <= 7; index++) {
    const path = `./mock/template${index}.json`;
    const template = JSON.parse(fs.readFileSync(path));
    const filtered = filter(template);
    filtered.forEach(
      (
        options: Record<
          string,
          | Partial<SQS.Queue>
          | Partial<Lambda.Function>
          | Partial<Lambda.EventSourceMapping>
        >,
      ) => {
        const worker = new Worker({
          id: `${index}_worker-${Date.now()}`,
          // @ts-ignore
          lambda: options.lambda,
          // @ts-ignore
          integration: options.integration,
          // @ts-ignore
          sqs: options.sqs,
        });
        workers.push(worker);
      },
    );
  }
  workers.forEach((worker: Worker) => {
    worker.analyze();
  });
};

const run1 = () => {
  fs.writeFileSync("b.json", "");
  for (let index = 7; index <= 7; index++) {
    const path = `./mock/template${index}.json`;
    const template = JSON.parse(fs.readFileSync(path));
    const options = filter(template);
    if (options.length > 0) {
      fs.appendFileSync("b.json", `\n --- Options of ${index} --- \n`);
      fs.appendFileSync("b.json", JSON.stringify(options, null, 2));
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
run1();
run2();
