import "./style.css";
import LambdaImage from "./icons/lambda.png";
import SQSImage from "./icons/sqs.png";
import { Worker } from "../../../../core";

interface Props {
  worker: Worker;
}

const Thumbnail = (props: Props) => (
  <div className="data-thumbnail text-white py-3">
    <div className="row">
      <div className="col text-center d-flex justify-content-center">
        <div className="service" style={{ backgroundColor: "#CD2164" }}>
          <img className="icon" src={SQSImage} />
          <div>SQS</div>
        </div>
      </div>
      <div className="col text-center d-flex justify-content-center align-items-center flex-column full-width">
        {/* <div>Integration</div> */}
        <div className="integration mt-2"></div>
      </div>
      <div className="col text-center d-flex justify-content-center">
        <div className="service" style={{ backgroundColor: "#D9660D" }}>
          <img className="icon" src={LambdaImage} />
          <div>Lambda</div>
        </div>
      </div>
    </div>
    <div className="data">
      <div className="row mt-1">
        <div className="col text-center">
          {props.worker.sqs.Properties?.QueueName?.toString()}
        </div>
        <div className="col text-center"></div>
        <div className="col text-center">
          {props.worker.lambda.Properties?.FunctionName?.toString()}
        </div>
      </div>
    </div>
  </div>
);
export default Thumbnail;
