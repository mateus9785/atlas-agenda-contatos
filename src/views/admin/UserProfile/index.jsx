import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import {
  Container,
  Row,
  CardHeader,
  Col,
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
} from "reactstrap";

import Header from "components/Header";
import Loading from 'components/Loading';
import validatePassword from 'common/validation/validatePassword';
import api from 'config/api';
import '../../styles.scss';

export default function UserProfile() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [strong, setStrong] = useState(false);
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

  useEffect(() => {
    if (newPassword !== newPasswordRepeat) {
      setError('As senhas não coincidem');
    } else {
      setError('');
    }
  }, [newPassword, newPasswordRepeat]);

  useEffect(() => {
    const { strong, error } = validatePassword(newPassword);
    setStrong(strong);
    if (error) setError(error);
  }, [newPassword]);

  async function changePassword(event) {

    event.preventDefault();
    if (!oldPassword || !newPassword || !newPasswordRepeat) {
      Swal.fire(
        'Atenção',
        'Preencha todos os campos e tente novamente!',
        'warning'
      );
      return;
    }

    if(!strong){
      Swal.fire(
        'Atenção',
        'Sua senha está fraca, verifique!',
        'warning'
      );
      return;
    }

    if (error) return;

    Swal.fire({
      title: 'Atenção',
      text: 'Deseja Realmente mudar sua senha?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim!'
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);

        try {
          await api.post(`/change-password`, {
            oldPassword,
            newPassword
          });
          Swal.fire(
            'Aprovado!',
            'Sua senha foi alterada com sucesso',
            'success'
          )
          history.goBack();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message
          })
        }
        setLoading(false);
      }
    })
  }

  return (
    <>
      {loading && <Loading />}
      <Header />
      <Container className="mt--7 reports-container" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0 mx-auto" xl="6">
            <Card className="bg-gradient-secondary shadow">
              <CardHeader className="bg-transparent">Alteração de senha</CardHeader>
              <div className='mt-3 ml-3'>
                <button className="button-like-link" onClick={() => history.goBack()}>
                  <i className="fa fa-arrow-left" /> Voltar
                </button>
              </div>
              <CardBody>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Senha Antiga"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
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
                    placeholder="Senha Nova"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    placeholder="Confirme sua Senha"
                    type="password"
                    value={newPasswordRepeat}
                    onChange={(e) => setNewPasswordRepeat(e.target.value)}
                    maxLength="24"
                  />
                </InputGroup>
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
                <Row className="float-right mr-3">
                  <Button
                    className="my-4"
                    color="primary"
                    type="button"
                    onClick={(e) => changePassword(e)}
                    disabled={error}
                  >
                    Alterar senha
                  </Button>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}