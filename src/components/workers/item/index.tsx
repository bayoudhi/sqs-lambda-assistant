import Suggestion from "./suggestion";
import Thumbnail from "./thumbnail";
import { Worker } from "../../../core";
interface Props {
  worker: Worker;
  suggestions: string[];
}
const WorkersItem = (props: Props) => (
  <div className="col-xs-12 col-sm-6 offset-3 col-xs-offset-0 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">
    <div className="card shadow-sm">
      <Thumbnail worker={props.worker} />
      <div className="card-body">
        {props.suggestions.length === 0 && (
          <div className="text-success">
            <i className="fa fa-check-circle"></i> Everything looks good
          </div>
        )}
        {props.suggestions.length > 0 && (
          <div className="mt-3">
            <h5>Suggestions:</h5>
            <>
              {props.suggestions?.map((suggestion: string, index: number) => (
                <Suggestion key={index} index={index} data={suggestion} />
              ))}
            </>
          </div>
        )}
      </div>
    </div>
  </div>
);
export default WorkersItem;
