import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  Button, 
  Card, 
  CardBody, 
  Col, 
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from 'reactstrap';

import Loading from 'components/Loading';
import api from 'config/api';
import '../../styles.scss';

export default function UnconfirmedEmail() {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (history.location.state) {
      const emailState = history.location.state.email;
      setEmail(emailState);
    }
  }, []);

  async function submit() {

    if (!email) {
      Swal.fire('Erro', 'O email é obrigatório, digite e tente novamente!', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('sendEmailChecked', { email });

      Swal.fire(
        'Enviado',
        'Um e-mail de confirmação foi enviado para o seu endereço de e-mail',
        'success'
      ).then(() => {
        history.push('/');
      });
    } catch (error) {

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
              <Link to="/">
                <i className="fa fa-arrow-left" /> Voltar
              </Link>
            </div>
            <div className="text-center text-muted mb-4">
              <small>Você ainda não confirmou seu e-mail!</small>
              <br></br>
              <small>
                Caso não tenha recebido o e-mail ou tenha expirado, clique no
                botão abaixo para reenviá-lo
              </small>
            </div>
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
                Reenviar
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
