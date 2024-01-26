import "./style.css";

interface Props {
  data: string;
  index: number;
}

const Suggestion = ({ data, index }: Props) => (
  <div className={index % 2 === 0 ? "px-1 root bg-light-gray" : "px-1 root"}>
    {data}
  </div>
);

export default Suggestion;
