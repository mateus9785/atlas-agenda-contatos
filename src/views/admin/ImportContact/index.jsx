import React from "react";

import Page from "components/Page";

import {
  Row,
  Col,
  Table,
} from "reactstrap";

function ImportContact() {
  var client_id = localStorage.getItem('client_id');
  var redirect_uri = localStorage.getItem('redirect_uri');
  var state = localStorage.getItem('state');

  return (
    <Page>
      <>
        <Col md="12" className="d-flex justify-content-end">
          <a
            className="link-like-button"
            href={`https://api.contaazul.com/auth/authorize?client_id=${client_id}&scope=sales&redirect_uri=${redirect_uri}&state=${state}`}
          >
            Conectar Conta Azul
          </a>
        </Col>
        <Row className="mt-3">
          <Col>
            <Table className="d-none d-md-table" responsive striped>
              <thead>
                <tr>
                  <th className="TableTh">Nome</th>
                  <th className="TableTh">Visualizar</th>
                  <th className="TableTh">Editar</th>
                  <th className="TableTh">Excluir</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-center" colSpan="4">Nenhum registro foi encontrado...</td></tr>
              </tbody>
            </Table>
            <ul style={{ listStyle: "none" }} className="d-md-none pl-0 mt-3" >
              <li className="mt-3 text-center">Nenhum registro foi encontrado...</li>
            </ul>
          </Col>
        </Row>
      </>
    </Page>
  );
}

export default ImportContact;
