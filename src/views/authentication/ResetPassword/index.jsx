import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  Col,
  Card,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Form,
  Input,
  InputGroupText,
  Button,
} from 'reactstrap';

import Loading from 'components/Loading';
import validatePassword from 'common/validation/validatePassword';
import api from 'config/api';

export default function ResetPassword() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [strong, setStrong] = useState(false);
  const [error, setError] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token, email } = useParams();

  useEffect(() => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
    } else {
      setError('');
    }
  }, [password, confirmPassword]);

  // Verifica a 'força' da senha
  useEffect(() => {
    const { strong, error } = validatePassword(password);
    setStrong(strong);
    if (error) setError(error);
  }, [password]);

  async function submit(e) {
    e.preventDefault();

    if (error) return;

    setLoading(true);
    try {
      const { data } = await api.post('/reset-password', {
        email,
        token,
        password,
      });

      Swal.fire('Sucesso', data.message, 'success').then(() => {
        history.push('/');
      });
    } catch (error) {
      Swal.fire('Erro', error.response.data.message, 'error');
    }
    setLoading(false);
  }

  return (
    <div className="div-container">
      {loading && <Loading />}
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Escolha sua nova senha!</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    type="password"
                    maxLength="24"
                  />
                </InputGroup>
                <InputGroup className="input-group-alternative mt-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua Senha"
                    type="password"
                    maxLength="24"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  segurança da senha:{' '}
                  {!strong ? (
                    <span className="text-danger font-weight-700">fraca</span>
                  ) : (
                    <span className="text-success font-weight-700">forte</span>
                  )}
                </small>
                <br></br>
                {error && <small className="error-info">{error}</small>}
              </div>
              <div className="text-center">
                <Button
                  onClick={(e) => submit(e)}
                  className="my-4"
                  color="primary"
                  type="button"
                  disabled={error}
                >
                  Enviar requisição
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
