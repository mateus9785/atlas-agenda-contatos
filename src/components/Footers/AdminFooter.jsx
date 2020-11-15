import React from "react";

import { Row, Col } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="text-center text-xl-left text-muted">
              <i className="fab fa-github"></i>
              <a
                className="font-weight-bold ml-1"
                href="https://www.github.com/mateus9785"
                rel="noopener noreferrer"
                target="_blank"
              >
                Github - mateus9785
              </a>
            </div>
          </Col>
          <Col xl="6">
            <div className="text-center text-xl-rigth text-muted">
              <i className="fab fa-linkedin"></i>
              <a
                className="font-weight-bold ml-1"
                href="https://www.linkedin.com/in/mateus-oliveira-de-almeida-6232b7151/"
                rel="noopener noreferrer"
                target="_blank"
              >
                linkedin - mateus oliveira de almeida
              </a>
            </div>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
