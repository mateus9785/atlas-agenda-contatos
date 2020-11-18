import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import Swal from "sweetalert2";
import axios from "axios";
import Creatable from 'react-select/creatable';

import { useHistory, useLocation } from "react-router-dom";

import "./styles.scss";

import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Table,
} from "reactstrap";

import Page from "components/Page";
import api from "config/api";
import errorRequest from "common/errorRequest";
import maskPhone from "common/mask/maskPhone";
import maskCep from "common/mask/maskCep";
import states from "common/statesOfBrazil";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Contact() {
  const history = useHistory();
  const query = useQuery();
  const idContact = query.get("idContact");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("AC");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState({});
  const [phones, setPhones] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [image, setImage] = useState({});
  const [deletedImage, setDeletedImage] = useState(false);

  async function addImage(event) {
    event.preventDefault();
    if (!event.target.files || !event.target.files.length) return;

    let file = event.target.files[0];

    setImage({
      name: file.name,
      file,
      urlImage: URL.createObjectURL(file),
    });
  }

  async function deleteImage(event) {
    event.preventDefault();

    Swal.fire({
      title: "Atenção",
      text: "Deseja realmente excluir essa imagem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim!",
    }).then(async (result) => {
      if (result.value) {
        setImage({});
        setDeletedImage(true);
        document.getElementById("contact-image").value = "";
      }
    });
  }

  async function buscaCep() {
    setLoading(true);
    await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`).then((res) => {
      setNeighborhood(res.data.bairro);
      setCity(res.data.localidade);
      setProvince(res.data.uf);
      setStreet(res.data.logradouro);
      return;
    })
      .catch(() => {
        Swal.fire("Erro", "Verifique o cep e tente novamente!", "error");
      });
    setLoading(false);
  }

  useEffect(() => {
    fetchGroupList();
    if (idContact)
      fetchContact();
  }, []);

  async function fetchGroupList() {
    setLoading(true);
    try {
      const { data } = await api.get(`/group`);
      if (data.data.length)
        setGroup(data.data[0]);
      setGroupList(data.data);
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  async function fetchContact() {
    setLoading(true);
    try {
      const { data } = await api.get(`/contact/${idContact}`);

      console.log(data.data)
      setName(data.data.name);
      setAddresses(data.data.Addresses);
      if (data.data.Phones.length)
        setPhones(data.data.Phones.map(phone => {
          return { type: 'phone-creatable', label: phone.name, value: phone.name, }
        }));
      if (data.data.ContactGroups.length)
        setGroups(data.data.ContactGroups.map(contactGruop => {
          return { type: 'group-creatable', label: contactGruop.Group.name, value: contactGruop.Group.name, }
        }));
      setImage({
        urlImage: data.data.urlContactImage,
      });
    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  function formatAddress(address) {
    const { street, number, neighborhood, city, province } = address
    return `${street}, ${number} ${neighborhood} - ${city}/${province}`;
  }

  async function addPhone(event) {
    event.preventDefault();
    if (phone && !phones.find(x => x.value === phone))
      setPhones(phones => [...phones, { label: phone, value: phone }]);

    setPhone("");
  }

  async function addGroup(event) {
    event.preventDefault();
    if (groupList.length && !groups.find(x => x.value === group.name))
      setGroups(groups => [...groups, { label: group.name, value: group.name }]);
  }

  async function addAddress(event) {
    event.preventDefault();
    if (street && number && neighborhood && city && province) {
      const newAddress = {
        street, number, neighborhood, city, province, cep: cep.replace(/\D/g, ""),
        complement
      }
      setAddresses(addresses => [...addresses, newAddress]);
      setNeighborhood("");
      setCity("");
      setProvince("");
      setStreet("");
      setNumber("");
      setComplement("");
      setCep("");
    }
  }

  function editeAddress(event, address, index) {
    event.preventDefault();
    setNeighborhood(address.neighborhood);
    setCity(address.city);
    setProvince(address.province);
    setStreet(address.street);
    setNumber(address.number);
    setComplement(address.complement);
    setCep(address.cep.replace(/\D/g, ""));
  }

  function deleteAddress(event, index) {
    event.preventDefault();
    setAddresses(addresses => addresses.filter((_, i) => i !== index));
  }

  async function saveContact(event) {
    event.preventDefault();
    if (!name || phones.length === 0) {
      Swal.fire('Atenção!', 'O nome do contato e pelo menos um telefone deve ser cadastrado, verifique!', 'warning')
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      data.append("name", name);
      phones.forEach(phone => {
        data.append("phones[]", JSON.stringify({ name: phone.value }));
      });
      addresses.forEach(address => {
        data.append("addresses[]", JSON.stringify({
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          province: address.province,
          cep: address.cep,
          complement: address.complement,
        }));
      });
      groups.forEach(group => {
        data.append("groups[]", JSON.stringify({ name: group.value }));
      });
      if(image.file)
        data.append("file", image.file);
      if (idContact)
        data.append("deletedImage", deletedImage);


      if (idContact)
        await api.put(`/contact/${idContact}`, data);
      else
        await api.post(`/contact`, data);

      history.push("/admin/contacts")

    } catch (error) {
      errorRequest(history, error);
    }
    setLoading(false);
  }

  return (
    <Page loading={loading}>
      <>
        <button className="button-like-link" onClick={() => history.goBack()}>
          <i className="fa fa-arrow-left" /> Voltar
        </button>
      </>
      <>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputName">
                  Nome
                </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="far fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-input"
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="col-6">
              <span className="mt-3 home-title-adm mb-3">
                Imagem de perfil:
              </span>
              <Row>
                <Col className="d-flex">
                  <div className="user-profile-preview-image mr-3">
                    {
                      image.urlImage &&
                      <span
                        className="user-profile-preview-image-delete"
                        onClick={(e) => deleteImage(e)}
                      >
                        <i className="fas fa-times" />
                      </span>
                    }
                    {
                      image.urlImage &&
                      <div className="table-image-contact">
                        <img alt="imagem enviada" className="image-contact" src={image.urlImage} />
                      </div>
                    }
                  </div>
                  <div className="user-profile-image mt-4 mb-2">
                    <input
                      id="contact-image"
                      type="file"
                      onChange={(e) => addImage(e, true)}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Label className="form-label" for="inputTel">
                Telefone
                  </Label>
              <InputGroup className="mb-1">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-phone" />
                  </InputGroupText>
                </InputGroupAddon>
                <NumberFormat
                  className="form-input"
                  type="text"
                  id="inputTel"
                  placeholder="Telefone"
                  format={maskPhone}
                  customInput={Input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="d-flex align-items-end mb-1">
              <Button
                color="success"
                onClick={(e) => addPhone(e)}
              >
                Adicionar contato
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Creatable
                id="creatable-phone"
                value={phones}
                isMulti
                onChange={(e) => {
                  if (e === null) {
                    setPhones([]);
                  } else {
                    setPhones(e);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={5}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputGroup">
                  Grupo
                </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-users" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="inputGroup"
                    type="select"
                    value={group.idGroup}
                    onChange={(e) => setGroup(groupList.find(x => x.idGroup.toString() === e.target.value.toString()))}
                  >
                    {
                      groupList && groupList.length > 0 &&
                      groupList.map((groupList) => (
                        <option key={"group-" + groupList.idGroup} value={groupList.idGroup}>{groupList.name}</option>
                      ))
                    }
                  </Input>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={3} className="d-flex align-items-end mb-1">
              <Button
                color="success"
                onClick={(e) => addGroup(e)}
              >
                Adicionar Grupo
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Creatable
                id="creatable-phone"
                value={groups}
                isMulti
                onChange={(e) => {
                  if (e === null) {
                    setGroups([]);
                  } else {
                    setGroups(e);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={3}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputZipcode">
                  CEP
                    </Label>
                <InputGroup className="mb-1">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-location-arrow" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <NumberFormat
                    className="form-input"
                    type="text"
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    customInput={Input}
                    format="##.###-###"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        buscaCep();
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      className="table-search-button"
                      onClick={() => buscaCep()}
                    >
                      <i className="fas fa-search" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputAddress">
                  Rua
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-road" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-input"
                    type="text"
                    id="inputAddress"
                    placeholder="Rua"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputDistrict">
                  Bairro
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="far fa-map" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-input"
                    type="text"
                    id="inputDistrict"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputCity">
                  Cidade
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-city" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-input"
                    type="text"
                    id="inputCity"
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputState">
                  Estado
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <span role="img" aria-label="icone estado">
                        🇸🇵
                          </span>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="inputState"
                    type="select"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    {states.map((state) => (
                      <option key={"state-" + state.id} value={state.nome}>
                        {state.nome}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputNumber">
                  Número
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>₁₂₃</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-input"
                    type="number"
                    id="inputNumber"
                    placeholder="Número"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-1">
                <Label className="form-label" for="inputComplement">
                  Complemento
                    </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="far fa-building" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="inputComplement"
                    placeholder="Complemento"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Button
                color="success"
                className="float-right"
                onClick={(e) => addAddress(e)}
              >
                Adicionar Endereço
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                className="d-none d-md-table mt-2"
                responsive
                striped
              >
                <thead>
                  <tr>
                    <th className="TableTh">Endereço</th>
                    <th className="TableTh">Complemento</th>
                    <th className="TableTh">CEP</th>
                    <th className="TableTh">Editar</th>
                    <th className="TableTh">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    addresses && addresses.length === 0 ?
                      <tr>
                        <td className="text-center" colSpan="5">Nenhum registro foi encontrado...</td>
                      </tr> :
                      addresses.map((address, index) =>
                        <tr key={"table-address-" + address.idAddress}>
                          <td>{formatAddress(address)}</td>
                          <td>{address.complement}</td>
                          <td>{maskCep(address.cep)}</td>
                          <td>
                            <div className="table-action-button-info" onClick={(e) => editeAddress(e, address)}>
                              <i className="fas fa-edit" />
                            </div>
                          </td>
                          <td>
                            <div className="table-action-button-danger" onClick={(e) => deleteAddress(e, index)}>
                              <i className="fas fa-trash-alt"></i>
                            </div>
                          </td>
                        </tr>
                      )
                  }
                </tbody>
              </Table>
              <ul style={{ listStyle: "none" }} className="d-md-none pl-0 mt-3" >
                {
                  addresses && addresses.length === 0 ?
                    <li className="mt-3">Nenhum registro foi encontrado...</li> :
                    addresses.map((address, index) =>
                      <li key={"list-address-" + address.idAddress} className="ml-3 mr-3">
                        <Row>
                          <smail>{formatAddress(address) + " - " + maskCep(address.cep)}</smail>
                        </Row>
                        <Row>
                          <smail>{address.complement}</smail>
                        </Row>
                        <Row>
                          <Col className="buttons-content p-0 d-flex justify-content-end">
                            <Button className="table-action-button-info" onClick={(e) => editeAddress(e, address)}>
                              <i className="fas fa-edit" />
                            </Button>
                            <Button className="table-action-button-danger" onClick={(e) => deleteAddress(e, index)}>
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </Col>
                        </Row>
                        <hr></hr>
                      </li>
                    )
                }
              </ul>
            </Col>
          </Row>
          <Button
            className="float-right mt-3"
            color="primary"
            onClick={(e) => saveContact(e)}
          >
            Salvar
          </Button>
        </Form>
      </>
    </Page>
  );
}
