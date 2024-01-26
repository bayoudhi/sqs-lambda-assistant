import { Worker } from "../../../core";
import WorkersItem from "../item";

interface Props {
  items: { worker: Worker; suggestions: string[] }[];
}

const WorkersCollection = ({ items }: Props) => (
  <>
    {items.map((item) => (
      <WorkersItem
        key={item.worker.id}
        worker={item.worker}
        suggestions={item.suggestions}
      />
    ))}
  </>
);
export default WorkersCollection;
