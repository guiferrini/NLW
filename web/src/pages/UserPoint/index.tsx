import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';

const Search = () => {

  const history = useHistory();
  const PointName = localStorage.getItem('PointName');
  const PointId = localStorage.getItem('PointId');
  
  async function apagar() {
    try{
      await api.delete(`points/${PointId}`, {
        headers: {
            Authorization: PointId,
        }
    });

    alert('Ponto de Coleta Apagado.')

    history.push('/');

    } catch (err) {
      alert('ERRO. Não foi possível apagar esse ponto de coleta, favor verificar informações.')
    }
  }

  async function alterar() {
    
  }

  return (
    <div id="page-user-search">
      <header>
          <img src={logo} alt="logo"/>

          <Link to='/'>
            <FiArrowLeft />
            Voltar para Busca
          </Link>
      </header>
      <div>

        <h1>Bem vindo, {PointName} </h1>
        <button onClick={apagar}>Apagar Ponto de Coleta</button>

        <h2>Alterar E-mail e Whatsapp</h2>
          <label htmlFor="email">E-mail</label>
          <input 
            type="text"
            name="email"
            id="email"
            // onChange={handleInputChange}
          />
          {/* { validacaoEmail && <div className="erro">{validacaoEmail}</div> } */}
        </div>
        <div className="field">
          <label htmlFor="whatsapp">Whatsapp</label>
          <input 
            type="text"
            name="whatsapp"
            id="whatsapp"
            // onChange={handleInputChange}
          />
          {/* { validacaoWhatsapp && <div className="erro">{validacaoWhatsapp}</div> } */}
          <button type="submit">Alterar</button>
      </div>
    </div>
  )
};

export default Search;