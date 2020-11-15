import React from 'react';
import { Link } from 'react-router-dom';

import { Button, Card, CardBody, Col } from 'reactstrap';

import '../../styles.scss';

export default function ConfirmedEmail() {
  return (
    <div className="div-container">
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>
                E-mail confirmado com sucesso, agora você já pode utilizar sua agenda de contatos
              </small>
            </div>
            <div className="text-center">
              <Link to="/">
                <Button type="button" color="primary">
                  Login
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
