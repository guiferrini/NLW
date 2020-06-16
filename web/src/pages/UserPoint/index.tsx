import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';
import { response } from 'express';

interface dataProps {
  email: string;
  whatsapp: string;
  data: string;
}

const Search = () => {
  const history = useHistory();
  const PointName = localStorage.getItem('PointName');
  const PointId = localStorage.getItem('PointId');
  const [inputData, setInputData] = useState({ //armazena infos email, whatsapp
    email: '',
    whatsapp: '',
  }); 
  const [whatsapp, setWhatsapp] = useState(''); //guarda whatsapp
  const [email, setEmail] = useState(''); //guarda email

  const [validacaoEmail, setValidacaoEmail] = useState(''); //validar email input
  const [validacaoWhatsapp, setValidacaoWhatsapp] = useState(''); //validar email input

  useEffect(() => {  
    api.get(`points/${PointId}`).then(response => {
      setEmail(response.data.point.email);
      setWhatsapp(response.data.point.whatsapp)
    })
    
  },[]) 
  
  async function apagar() {
    const r = window.confirm("Todas as informçõe serão peridas. Você tem certeza que quer apagar seu Ponto de Coleta?"); 
        if(r == true) {
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
}

  async function alterar() {
  try{ 
    const { email, whatsapp } = inputData;
    
    //Validação email
    if (email.indexOf('@') == -1 || email.indexOf('.com') == -1) {
      setValidacaoEmail('Email inválido, favor verificar');
    } else {
      setValidacaoEmail('');
    }

    //Validação whatsapp
    // const x = Number(whatsapp);
    // console.log(typeof(x)); 
    // const letras = ['qwertyuiopasdfghjklçzxcvbnm,.-_()'];
    // const numero = [1234567890]
    // if (whatsapp.indexOf(letras)) {
    //   setValidacaoWhatsapp('Favor digitar apenas Números');
    // } else {
    //   setValidacaoWhatsapp('');
    // }

    const response = await api.put(`points/${PointId}`, { email, whatsapp });

    alert('Email e Whatsapp alterados com sucesso.')

    history.push('/')
  } catch (err) {
    alert('Erro ao alterar Email e Whatsapp, favor efetuar novamente.')
  }}

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value }); //'name' é generico p tds, tds tem 'name', value é o nome, email e whatsapp
  }

  return (
    
    <div id="page-user-search">
      <header>
          <img src={logo} alt="logo"/>

          <Link to='/'> 
            <FiArrowLeft />
            Sair / Voltar para Busca
          </Link>
      </header>
      <div>
        <h1>Bem vindo, {PointName} </h1>
        
        <button onClick={apagar}>Apagar Ponto de Coleta</button> 
        
        <h2>Alterar/Confirme E-mail e Whatsapp</h2>
          <label htmlFor="email">E-mail</label>
          <input 
            type="text"
            name="email"
            id="email"
            onChange={handleInputChange}
            placeholder={email}
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
            placeholder={whatsapp}
          />
          {/* { validacaoWhatsapp && <div className="erro">{validacaoWhatsapp}</div> } */}
          <button onClick={alterar}>Alterar</button>          
      </div>
    </div>
  )
};

export default Search;