import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Swal from 'sweetalert2';

import "./styles.scss";
import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Button,
  Table,
  InputGroupText,
  Input,
} from "reactstrap";

import api from "config/api";
import Page from "components/Page";
import AutoSuggest from "components/AutoSuggest";
import errorRequest from "common/errorRequest";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Contacts() {
  const query = useQuery();
  const history = useHistory();
  const [idGroup, setIdGroup] = useState(query.get("idGroup") ? query.get("idGroup") : "");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchSuggestionContact();
    fetchGroup();
  }, [])

  useEffect(() => {
    fetchContacts(idGroup);
  }, [page]);

  async function fetchGroup() {
    setLoading(true);
    try {
      const { data } = await api.get(`/group`);
      setGroups(data.data);
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  const lastContactListElementRef = createRefElement();
  const lastContactTableElementRef = createRefElement();

  function createRefElement() {
    const observer = useRef();
    const lastElementRef = useCallback(node => {
      if (loading) return
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page => page + 1);
        }
      })
      if (node) observer.current.observe(node)
    }, [loading, hasMore]);
    return lastElementRef;
  }

  async function fetchSuggestionContact() {
    setLoading(true);
    try {
      const { data } = await api.get(`/contact`);
      setSuggestions(data.data);
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  async function fetchContacts(idGroup, reset = false) {
    setLoading(true);
    try {
      const params = {
        limit,
        offset: page - 1,
        search,
        idGroup,
      }
      const { data } = await api.get(`/contact/paginate`, { params });
      if (reset)
        setContacts(data.data);
      else
        setContacts(contacts => [...contacts, ...data.data]);
      const total = data.pagination.total;
      const totalPages = Math.ceil(total / limit);
      if (totalPages === page)
        setHasMore(false);
      else
        setHasMore(true);
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  function letterWithoutAccent(letter) {
    const withAccent = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    const withoutAccent = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    const position = withAccent.indexOf(letter);
    return position === -1 ? letter : withoutAccent[position];
  }

  async function deleteContact(event, idContact) {
    event.preventDefault();

    Swal.fire({
      title: 'Atenção',
      text: 'Deseja realmente excluir esse contato?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua ele!'
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);

        try {
          await api.delete(`/contact/${idContact}`)
          setContacts(contacts => contacts.filter(x => x.idContact !== idContact));

          Swal.fire('Deletado!', 'O contato foi excluido com sucesso', 'success');
        } catch (error) {
          errorRequest(history, error);
        }

        setLoading(false);
      }
    })
  }

  async function changeGroup(idGroup) {
    setIdGroup(idGroup);
    await fetchContacts(idGroup, true);
    history.push(`/admin/contacts?idGroup=${idGroup}`)
  }

  return (
    <Page loading={loading}>
      <>
        <Row className="mb-4">
          <Col md="7" xs="12" className="mb-2">
            <InputGroup>
              <AutoSuggest
                value={search}
                onChange={(_, { newValue }) => setSearch(newValue)}
                arraySuggestions={suggestions}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    fetchContacts(idGroup, true);
                  }
                }}
              />
              <InputGroupAddon color="primary" addonType="append">
                <Button className="table-search-button">
                  <i className="fas fa-search" onClick={() => fetchContacts(idGroup, true)} />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col md="5" xs="12" className="mb-2">
            <InputGroup className="col-xs-6">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-users" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="inputGroup"
                type="select"
                value={idGroup}
                onChange={(e) => changeGroup(e.target.value)}
              >
                <option key="group-0" value="">Todos os grupos</option>
                {
                  groups && groups.length > 0 &&
                  groups.map((group) =>
                    <option key={"group-" + group.idGroup} value={group.idGroup}>{group.name}</option>
                  )
                }
              </Input>
            </InputGroup>
          </Col>
          <Col md="12" className="d-none d-md-table">
            <Button className="float-right" color="success" onClick={() => history.push(`/admin/contact`)}>Criar novo contato</Button>
          </Col>
          <Col className="d-md-none button-fixed-mobile">
            <Button className="rounded-button mb-2 mr-2" color="success" onClick={() => history.push(`/admin/contact`)}>+</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="d-none d-md-table" responsive striped>
              <thead>
                <tr>
                  <th className="TableTh">Imagem</th>
                  <th className="TableTh">Nome</th>
                  <th className="TableTh">Editar</th>
                  <th className="TableTh">Excluir</th>
                </tr>
              </thead>
              <tbody>
                {
                  contacts && contacts.length === 0 ?
                    <tr>
                      <td className="text-center" colSpan="4">Nenhum registro foi encontrado...</td>
                    </tr> :
                    contacts.map((contact, index) => (
                      <tr key={contact.idContact} ref={contacts.length === index + 1 ? lastContactTableElementRef : null}>
                        <td className="TableTd table-adm-td">
                          <div className="table-image-contact">
                            {
                              contact.nameFile ?
                                <img className="table-image-contact" src={contact.urlContactImage} alt="avatar"></img> :
                                <span className="contact-name-letter">{letterWithoutAccent(contact.name[0]).toUpperCase()}</span>
                            }
                          </div>
                        </td>
                        <td className="TableTd">{contact.name}</td>
                        <td className="TableTd">
                          <Button
                            className="table-action-button-info"
                            onClick={() => history.push(`/admin/contact?idContact=${contact.idContact}`)}
                          >
                            <i className="fas fa-edit" />
                          </Button>
                        </td>
                        <td className="TableTd">
                          <Button
                            disabled={contact.isUserContact}
                            className="table-action-button-danger"
                            onClick={(e) => deleteContact(e, contact.idContact)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </Table>
            <ul style={{ listStyle: "none" }} className="d-md-none pl-0 mt-3" >
              {
                contacts && contacts.length === 0 ?
                  <li className="mt-3 text-center">Nenhum registro foi encontrado...</li> :
                  contacts.map((contact, index) => (
                    <li key={contact.idContact} ref={contacts.length === index + 1 ? lastContactListElementRef : null}>
                      <Row className="d-flex justify-content-between">
                        <Col xs="8" className="d-flex p-0">
                          <div className="list-image-contact mt-1">
                            {
                              contact.nameFile ?
                                <img className="list-image-contact" src={contact.urlContactImage} alt="avatar"></img> :
                                <span className="contact-name-letter">{letterWithoutAccent(contact.name[0]).toUpperCase()}</span>
                            }
                          </div>
                          <div className="pl-1">
                            <strong>Nome:</strong><br />
                            <small>{contact.name}</small>
                          </div>
                        </Col>
                        <Col xs="4" className="buttons-content p-0">
                          <Button
                            className="table-action-button-info"
                            onClick={() => history.push(`/admin/contact?idContact=${contact.idContact}`)}
                          >
                            <i className="fas fa-edit" />
                          </Button>
                          <Button
                            disabled={contact.isUserContact}
                            className="table-action-button-danger"
                            onClick={(e) => deleteContact(e, contact.idContact)}
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
          </Col>
        </Row>
      </>
    </Page>
  );
}

export default Contacts;
