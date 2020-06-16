import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Request, Response, response } from 'express';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiYoutube } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent, divIcon } from 'leaflet';
import axios, { AxiosResponse } from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';

import api from '../../services/api';
import { point } from 'leaflet';
import { stringify } from 'querystring';
import { number, string, object } from '@hapi/joi';

interface UF {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

interface Filtro {
  name: string;
  email: string;
  id: number;
  latitude: number,
  longitude: number,
  image: string,
  whatsapp: number,
  city: string,
  uf: string,
  image_url: string,
  items: string,
  Array: string,
}

interface Filtro2 {
    id: number,
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    latitude: number,
    longitude: number,
    city: string,
    uf: string,
    image_url: string
    title: string,
    items: string,
    Array: string,
    0: string,
    1: string,
}

interface PropsId {
  id: number;
}

const User = () => {
  const history = useHistory();
  
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  const [filtro, setFiltro] = useState<Filtro[]>([]);
  const [id, setId] = useState<PropsId[]>([]);  
  const [check, setCheck] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
  const [pointInfos, setPointsInfos] = useState<Filtro2[]>([]); //salva as infos dos Points depois de filtar por UF e City
 

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

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
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>
    ): Promise<void> {
      event.preventDefault();

    const uf = selectedUf;
    const city = selectedCity;

    //busca Point por UF e City 
    try {

      const ola = await api.get(`/points?uf=${uf}&items=1,%202,%203,%204,%205,%206&city=${city}`)
      const inputData = ola.data;

      if(inputData == 0){  
        alert (`Ainda não existe Ponto de Coleta cadastrados para a Cidade de ${city}.`)
      }

      setFiltro(inputData);
 
      //busca Point por ID (com tds infos), dentro do UF e City
      const check = inputData.map((filter: any) => {return (filter.id)}); //tras tds ids
 
      const b = []; //Array só com IDs
      for (var i = 0; i < check.length; i++) { 
          b[check[i]] = check[i];
      }
        const pointId = [];
        for (var key in b) {
            pointId.push(key);
        }
      for (var i = 0; i < pointId.length; i++) {  
        
        const dadosId = await api.get(`/points/${pointId[i]}`)
        const foi = Object.values(dadosId.data) // com esse funciona       
        setPointsInfos((verdao) => verdao.concat(Object.values(dadosId.data)) ); //funciona com Array inteiro hehe
        
        console.log(foi)
      } 
    } catch (err) {
      alert('falha')
    }
  }; 
  return (
    <div id="page-user">
        <header>
          <img src={logo} alt="logo"/>

          <Link to='/'>
            <FiArrowLeft />
            Voltar para Home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <div className="field">
            <label htmlFor="uf">Estado(UF)</label>
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
          
          <button type="submit">Buscar Ponto de Coleta</button>
        </form>
        

        <output>
          {/* <Map center={[-23.06638672183509,-46.941618919372566]} zoom={13}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
           
            <Marker position={selectedPosition} />
          </Map> */}

          <h1>Resultado</h1>
          <ul>
            {pointInfos.map(busca => (
              <li key={busca.id}>
                <div>
                  <strong>Nome do Ponto: {busca.name}</strong>
                  <h1><img src={busca.image_url} alt="foto do ponto"/></h1>
                </div>
                <div>
                  <h1>Contato: </h1>
                  <h2>Whatsapp: {busca.whatsapp}</h2>
                  <h2>Email: {busca.email}</h2>                
                </div>
              </li> 
            ))}
          </ul>
                  
        </output>
    </div>
  )
};

export default User;