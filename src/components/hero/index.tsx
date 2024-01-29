interface Props {
  onOpenModal: () => void;
  onImportTemplate: () => void;
}

const Hero = ({ onOpenModal }: Props) => (
  <main>
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">SQS Lambda Assistant</h1>
          <p className="lead text-body-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            <button className="btn btn-primary my-2" onClick={onOpenModal}>
              Import CloudFormation template
            </button>
          </p>
        </div>
      </div>
    </section>
  </main>
);
export default Hero;
