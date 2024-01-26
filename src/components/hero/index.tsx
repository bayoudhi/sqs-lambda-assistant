interface Props {
  onOpenModal: () => void;
  onImportTemplate: () => void;
}

const Hero = ({ onOpenModal }: Props) => (
  <>
    <header data-bs-theme="dark">
      <div className="collapse text-bg-dark" id="navbarHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4>About</h4>
              <p className="text-body-secondary">
                Add some information about the album below, the author, or any
                other background context. Make it a few sentences long so folks
                can pick up some informative tidbits. Then, link them off to
                some social networking sites or contact information.
              </p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4>Contact</h4>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-white">
                    Follow on Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Like on Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Email me
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <a href="#" className="navbar-brand d-flex align-items-center">
            <i className="fa fa-info-circle mx-1"></i>
            <strong>SQS Lambda Assistant</strong>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarHeader"
            aria-controls="navbarHeader"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>

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
  </>
);
export default Hero;
