import { useState } from "react";
import { yamlParse } from "yaml-cfn";
import Hero from "../../components/hero";
import TemplateModal, {
  EditorLanguage,
} from "../../components/modals/template";
import WorkersCollection from "../../components/workers/collection";
import { advisor, Worker } from "../../core";
import { filter } from "../../core/helpers/filter";
import { TEMPLATE_JSON } from "../../_mocks/template_json";

const Home = () => {
  const [items, setItems] = useState<
    { worker: Worker; suggestions: string[] }[]
  >([]);
  const analyze = (template: string) => {
    try {
      //@ts-ignore
      const result = filter(template);
      setItems(
        result.map((item) => {
          const worker = new Worker({
            id: JSON.stringify(item.integration),
            //@ts-ignore
            integration: item.integration,
            //@ts-ignore
            lambda: item.lambda,
            //@ts-ignore
            sqs: item.sqs,
          });
          const suggestions = advisor.analyze(worker);
          return {
            suggestions,
            worker,
          };
        }),
      );
      setError(null);
      setIsOpenModal(false);
    } catch (error) {
      console.info(error);
      setError(
        "Could not perform analysis. Please check your template and try again.",
      );
    }
  };
  const handleOnImportTemplate = () => {
    try {
      if (editorLanguage === "yaml") {
        analyze(yamlParse(content));
      } else {
        analyze(JSON.parse(content));
      }
    } catch (error) {
      console.info(error);
      setError("Invalid template");
    }
  };
  const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>("json");
  const handleOnChangeLanguage = (language: EditorLanguage) => {
    setEditorLanguage(language);
  };
  const [content, setContent] = useState<string>(
    JSON.stringify(TEMPLATE_JSON, null, 2).toString(),
  );
  const handleOnChangeContent = (c: string) => {
    setContent(c);
  };
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOnOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleOnCloseModal = () => {
    setIsOpenModal(false);
  };
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <main>
        <Hero
          onOpenModal={handleOnOpenModal}
          onImportTemplate={handleOnImportTemplate}
        />
        <div className="album py-5 bg-body-tertiary">
          <div className="container">
            <div className="row g-3">
              <WorkersCollection items={items} />
            </div>
          </div>
        </div>
      </main>
      <TemplateModal
        content={content}
        language={editorLanguage}
        error={error}
        isOpen={isOpenModal}
        onChangeLanguage={handleOnChangeLanguage}
        onClose={handleOnCloseModal}
        onChangeContent={handleOnChangeContent}
        onClickConfirm={handleOnImportTemplate}
      />
    </>
  );
};

export default Home;
