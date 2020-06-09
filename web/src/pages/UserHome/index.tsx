import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.svg';

import api from '../../services/api';


const User = () => {
  const history = useHistory();
  const [id, setId] = useState('');

  function handleSubmit() { //async function handleSubmit() {
    //e.preventDefault();
    
    try {
      api.get('points'); //await api.get('points');
      
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
            <select name="uf" id="uf" >
              <option value="0">Selecione uma UF</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="city">Cidade</label>
            <select name="city" id="city" >
              <option value="0">Selecione uma Cidade</option>
              ))}
            </select>
          </div>

          <button type="submit">Buscar Ponto de Coleta</button>
        </form>
    </div>
  )
};

export default User;