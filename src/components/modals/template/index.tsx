import Editor from "@uiw/react-textarea-code-editor";
import Modal from "react-pure-modal";
import "./style.css";

export type EditorLanguage = "yaml" | "json";

interface Props {
  content?: string;
  language?: EditorLanguage;
  error?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeLanguage: (language: EditorLanguage) => void;
  onChangeContent: (text: string) => void;
  onClickConfirm: () => void;
}
const TemplateModal = ({
  content = "",
  language = "json",
  error = null,
  isOpen,
  onClose,
  onChangeContent,
  onChangeLanguage,
  onClickConfirm,
}: Props) => (
  <Modal
    header={
      <div className="template-modal-header d-flex align-items-center">
        <div className="me-2">Import CloudFormation template</div>
      </div>
    }
    footer={
      <div>
        <button className="btn btn-secondary me-1" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onClickConfirm}>
          Confirm
        </button>
        <div className="text-danger d-inline mx-2">{error}</div>
      </div>
    }
    isOpen={isOpen}
    onClose={() => {
      onClose();
      return true;
    }}
    width="640px"
  >
    <>
      <div className="form-group">
        <div className="d-flex justify-content-between mb-2">
          <span>Paste your CloudFormation template</span>
          <div className="btn-group">
            <button
              type="button"
              className={
                language === "json"
                  ? "btn btn-sm btn-primary"
                  : "btn btn-sm btn-secondary"
              }
              onClick={() => onChangeLanguage("json")}
            >
              JSON
            </button>
            <button
              type="button"
              className={
                language === "yaml"
                  ? "btn btn-sm btn-primary"
                  : "btn btn-sm btn-secondary"
              }
              onClick={() => onChangeLanguage("yaml")}
            >
              YAML
            </button>
          </div>
        </div>
        <Editor
          id="textarea-template-modal"
          value={content}
          language={language}
          placeholder={
            language === "json"
              ? "Paste your JSON here!"
              : "Paste your YAML here!"
          }
          padding={15}
          minHeight={240}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
          onChange={(e) => onChangeContent(e.target.value)}
        />
      </div>
    </>
  </Modal>
);
export default TemplateModal;
