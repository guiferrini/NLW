import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';
import { response } from 'express';

const Search = () => {

  return (
    <div id="page-user-search">
      <header>
          <img src={logo} alt="logo"/>

          <Link to='/user-home'>
            <FiArrowLeft />
            Voltar para Busca
          </Link>
      </header>
      <div>

        Search
      </div>
    </div>
  )
};

export default Search;