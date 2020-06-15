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
      </div>
    </div>
  )
};

export default Search;