import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

export default function Home() {
  const history = useHistory(); 
  
  async function entrar() {  
    try{
      const id = prompt(`Digite seu ID para entrar: `)
      console.log(id);
  
      const response = await api.get(`points/${id}`)
      console.log(response.data);
      localStorage.setItem('PointId', response.data.point.id);
      localStorage.setItem('PointName', response.data.point.name)
      
      history.push('/user-point');

    } catch (err) {
      alert('ID não encontrado, tente novamente.')
    }
  }
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta"/>
        </header> 

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>

          <button onClick={entrar}>
            <span>
              <FiLogIn />
            </span>
            <strong>Entrar no Seu ponto de coleta</strong>
          </button>
          
          <Link to="/user-home">
            <span>
              <FiLogIn />
            </span>
            <strong>Busque um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  )
};

