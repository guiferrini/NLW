import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone/index';

import './styles.css';

import logo from '../../assets/logo.svg';
import { response } from 'express';
import { isNumber } from 'util';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface UF {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

const CreatePoint = () => {
  // buscar e armazenar items do backend
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  //buscar e armazenar cidade e estado por UF
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); //armazena os items selecionados pelo usuario
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]); //armezana longitude e latitude do cliente ao abrir app
  const [selectedFile, setSelectedFile] = useState<File>(); // armazena imagem do ponto de coleta

  const [inputData, setInputData] = useState({ //armazena os dados de tds Inputs
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedUf, setSelectedUf] = useState('0'); //armazena a UF selecionada pelo usuario
  const [selectedCity, setSelectedCity] = useState('0'); //armazena a Cidade selecionada pelo usuario
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]); //armezana longitude e latitude qdo cliente clica no mapa
    
  const [validacaoName, setValidacaoName] = useState(''); //validar nome input
  const [validacaoEmail, setValidacaoEmail] = useState(''); //validar email input
  const [validacaoWhatsapp, setValidacaoWhatsapp] = useState(''); //validar email input
  const [validacaoItems, setValidacaoItems] = useState(''); //validar seleção de no min 1 item

  const history = useHistory();

  //Qdo usuario iniciar app, informa localização atual dele
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([ latitude, longitude ]);
    });
  }, []);

  //busca de UFs - 1° informação
  useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufSigla = response.data.map(uf => uf.sigla);

        setUfs(ufSigla);
      });
  }, []);

    //busca de Cidades de acordo com o UF - 2° informação
    //Carregar as cidades sempre q a UF mudar
  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityName = response.data.map(city => city.nome);

      setCities(cityName);
    });

  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  //Fução para click no mapa e coloca alfinete
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  //Armazenamento de Input - área: Dados
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value }); //'name' é generico p tds, tds tem 'name', value é o nome, email e whatsapp
  } 

  //Armazenamento de Items selecionados pelo usuaario
  function handleSelectItem(id: number) {
    const alredySelected = selectedItems.findIndex(item => item === id); //se retonar -1 n esta selecionado (encontrado)
    //verifica se item selecionado já estava selecionado anteriormente
    if (alredySelected >= 0) {
      //se já estava selecionado, remove
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems)
    } else {
      //se n estava selecionado, adiciona
      setSelectedItems([ ...selectedItems, id])
    }
  }

  //Envio do formulário p API
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    
    const { name, email, whatsapp } = inputData;
      //Validação nome min 3 caracteres
      if (name.length < 3) {
        setValidacaoName('O Nome deve conter no minimo 3 caracteres');
      } else {
        setValidacaoName('');
      }
      //Validação email
      if (email.indexOf('@') == -1 || email.indexOf('.com') == -1) {
        setValidacaoEmail('Email inválido, favor verificar');
      } else {
        setValidacaoEmail('');
      }

      //Validação whatsapp
      //esta voltando string - terminar validação
      
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();
    
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    //validando items, obrigatorio selecionar
    if (items[0] == null) {
      setValidacaoItems('Selecione no minimo 1 item a ser coletado')
      return
    } else {
      setValidacaoItems('');
    }

    data.append('items', items.join(','));

    if (selectedFile) { //tem q criar condição, pois selectedFile pode ser nulo/vazio
      data.append('image', selectedFile) 
    }

    await api.post('points', data);
    
    alert('Ponto de coleta Criado!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="logo"/>

        <Link to='/'>
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do Ponto de Coleta</h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da Entidade</label>
              <input 
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
              { validacaoName && <div className="erro">{validacaoName}</div> }
            </div>
            
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="text"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
                { validacaoEmail && <div className="erro">{validacaoEmail}</div> }
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
                { validacaoWhatsapp && <div className="erro">{validacaoWhatsapp}</div> }
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}> 
              <TileLayer 
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={selectedPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                  <option value="0">Selecione uma UF</option>
                  {ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                  <option value="0">Selecione uma Cidade</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de Coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(item => (
                <li 
                  key={item.id} 
                  onClick={() => handleSelectItem(item.id) }
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
              </li>
              ))}
            </ul>
            { validacaoItems && <div className="erro">{validacaoItems}</div> }
          </fieldset>

          <button type="submit">Cadastrar Ponto de Coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;