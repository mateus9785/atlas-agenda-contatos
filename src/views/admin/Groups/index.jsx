import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Swal from 'sweetalert2';

import "./styles.scss";
import {
  Row,
  Col,
  Button,
  Table,
  Input,
} from "reactstrap";

import api from "config/api";
import Page from "components/Page";
import errorRequest from "common/errorRequest";
import CustomPagination from "components/CustomPagination";

function Groups() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [idGroup, setIdGroup] = useState("");
  const [name, setName] = useState("");
  const [total, setTotal] = useState();
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchGroups();
  }, [page]);

  async function fetchGroups() {
    setLoading(true);
    try {
      const { data } = await api.get(`/group/paginate?limit=${limit}&offset=${page - 1}`);
      setGroups(data.data);
      setTotal(data.pagination.total);
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  async function editeGroup(event, group) {
    event.preventDefault();

    setIdGroup(group.idGroup);
    setName(group.name);
  }

  async function deleteGroup(event, idGroup) {
    event.preventDefault();

    Swal.fire({
      title: 'Atenção',
      text: 'Deseja Realmente excluir esse grupo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua ele!'
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);

        try {
          await api.delete(`/group/${idGroup}`)

          Swal.fire('Deletado!', 'O Grupo foi excluido com sucesso', 'success');
          await fetchGroups();
        } catch (error) {
          errorRequest(history, error);
        }

        setLoading(false);
      }
    })
  }

  async function cancelEdition(event) {
    event.preventDefault();
    setName("");
    setIdGroup("");
  }

  async function saveGroup(event) {
    event.preventDefault();
    if (!name) {
      Swal.fire('Atenção!', 'O nome do grupo deve ser preenchido', 'warning')
      return;
    }

    setLoading(true);
    try {

      if (idGroup)
        await api.put(`/group/${idGroup}`, { name });
      else
        await api.post(`/group`, { name });

      await fetchGroups();
      setName("");
      setIdGroup("");

    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  return (
    <Page loading={loading}>
      <>
        <Row className="mb-4">
          <Col md="5" xs="12" className="d-flex justify-content-end mt-2">
            <Input
              placeholder="Nome do Grupo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength="30"
            />
          </Col>
          <Col md="6" xs="12" className="d-flex mt-2">
            <Button color="success" className="col-6" onClick={(e) => saveGroup(e)}>Salvar</Button>
            {
              idGroup &&
              <Button color="danger" className="col-6" onClick={(e) => cancelEdition(e)}>Cancelar</Button>
            }
          </Col>
        </Row>
        <Row>
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
                {
                  groups && groups.length === 0 ?
                    <tr><td className="text-center" colSpan="4">Nenhum registro foi encontrado...</td></tr> :
                    groups.map((group) =>
                      <tr key={group.idGroup}>
                        <td>{group.name + " (" + group.ContactGroups.length + ")"}</td>
                        <td>
                          <Button
                            className="table-action-button-success"
                            onClick={() => history.push(`/admin/contacts?idGroup=${group.idGroup}`)}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                        </td>
                        <td>
                          <Button
                            disabled={!group.idUser || !!idGroup}
                            className="table-action-button-info"
                            onClick={(e) => editeGroup(e, group)}
                          >
                            <i className="fas fa-edit" />
                          </Button>
                        </td>
                        <td>
                          <Button
                            disabled={!group.idUser || !!idGroup}
                            className="table-action-button-danger"
                            onClick={(e) => deleteGroup(e, group.idGroup)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </Table>
            <ul style={{ listStyle: "none" }} className="d-md-none pl-0 mt-3" >
              {
                groups && groups.length === 0 ?
                  <li className="mt-3 text-center">Nenhum registro foi encontrado...</li> :
                  groups.map((group) => (
                    <li key={group.idGroup}>
                      <Row className="d-flex justify-content-between">
                        <Col xs="5">
                          <strong>Nome:</strong><br />
                          <small>{group.name + " (" + group.ContactGroups.length + ")"}</small>
                        </Col>
                        <Col xs="7" className="buttons-content">
                          <Button
                            className="table-action-button-success"
                            onClick={() => history.push(`/admin/contacts?idGroup=${group.idGroup}`)}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                          <Button
                            disabled={!group.idUser || !!idGroup}
                            className="table-action-button-info"
                            onClick={(e) => editeGroup(e, group)}
                          >
                            <i className="fas fa-edit" />
                          </Button>
                          <Button
                            disabled={!group.idUser || !!idGroup}
                            className="table-action-button-danger"
                            onClick={(e) => deleteGroup(e, group.idGroup)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </Col>
                      </Row>
                      <hr></hr>
                    </li>
                  ))
              }
            </ul>
            <div className="d-flex my-3 justify-content-center">
              <CustomPagination
                total={total}
                page={page}
                length={groups.length}
                limit={limit}
                setPage={setPage}
              />
            </div>
          </Col>
        </Row>
      </>
    </Page>
  );
}

export default Groups;
