import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from 'reactstrap';

import './styles.scss';

import api from 'config/api';
import Loading from 'components/Loading';
import errorRequest from "common/errorRequest";

export default function ForgotPassword() {

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    try {
      await api.post('/request-reset-password', { email });

      Swal.fire('Pronto', 'Um link para alteração de senha foi enviado para o seu e-mail', 'success').then(() => {
        history.push('/');
      });
    } catch (error) {
      errorRequest(history, error)
    }
    setLoading(false);
  }
  return (
    <div className="div-container">
      {loading && <Loading />}
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div>
              <button className="button-like-link" onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" /> Voltar
                </button>
            </div>
            <div className="text-center text-muted mb-4">
              <small>Informe seu e-mail para criar uma nova senha!</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    maxLength="80"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  onClick={(e) => submit(e)}
                  className="my-4"
                  color="primary"
                  type="button"
                >
                  Enviar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
