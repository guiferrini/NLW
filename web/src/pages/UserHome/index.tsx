import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';

import api from '../../services/api';
import { response } from 'express';

interface UF {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

const User = () => {
  const history = useHistory();
  
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');
  

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
  
  // const [id, setId] = useState('');
  
  // const [ponto, setponto] = useState('');

  
  
  function handleSubmit() { //async function handleSubmit() {
    //e.preventDefault();
    console.log(selectedUf, selectedCity);
    const uf = selectedUf;
    const city = selectedCity;

    api.get(`points?uf=${uf}&city=${city}`).then(response => {
      console.log(response.data);
    })

   
    try {
      // useEffect(() => {
      //   await api.get('/points').then(response => {
      //     const inputData = response.data.uf;
      //     console.log('inputData');
    
      //     setponto(response.data)
      //     console.log(response.data);
      //   })
      // }, []); 
      
      history.push('/user-search'); //caminho pontos com filtro
      return
    } catch (err) {
      alert('falha');
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
    </div>
  )
};

export default User;