import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import Swal from 'sweetalert2';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardImg,
} from "reactstrap";

import Loading from "components/Loading";
import api from "config/api";
import validationEmail from "common/validation/validationEmail";

import "./styles.scss";
import logo from "../../../assets/img/contact-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  async function submit() {
    if (!email || !password) {
      setError("Preencha o email e senha por favor!");
      return;
    }

    if (validationEmail(email)) {
      setError("Formato de e-mail inválido!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("authenticate", { email, password, });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("name", data.data.name);
      localStorage.setItem("idUser", data.data.idUser);
      localStorage.setItem("state", data.data.state);
      localStorage.setItem("client_id", data.data.client_id);
      localStorage.setItem("redirect_uri", data.data.redirect_uri);
      localStorage.setItem("contaAzulAuthenticated", data.data.contaAzulAuthenticated);

      history.push("/admin/contacts");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        if (!error.response.data.data.emailChecked)
          history.push('/unconfirmed-email', { email });
      } else if(error.response && error.response.data) {
        setError(error.response.data.message);
      }else{
        Swal.fire('Erro!', 'Ocorreu um erro, tente novamente', 'error');
      }
    }
    setLoading(false);
  }

  return (
    <div className="div-container">
      {loading && <Loading />}
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="bg-transparent p-5"
          >
            <CardImg src={logo} alt="logo" />
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Login</small>
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
                    maxlenght="100"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
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
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) submit();
                    }}
                    maxLength="24"
                  />
                </InputGroup>
              </FormGroup>
              {error && <small className="error-info">{error}</small>}
              <div className="text-center">
                <Button
                  onClick={() => submit()}
                  className="my-4"
                  color="primary"
                  type="button"
                >
                  Acessar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <Link to="/forgot-password">
              <small>Esqueceu sua senha?</small>
            </Link>
          </Col>
          <Col className="text-right" xs="6">
            <Link to="/register">
              <small>Cadastre-se</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </div>
  );
}
