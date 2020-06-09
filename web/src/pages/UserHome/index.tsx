import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.svg';

// function handleSelectItem(id: number) {
//   async function handleSubmit(event: FormEvent) {  

//     await api.post('points', data);
    
//     alert('Ponto de coleta Criado!');

//     history.push('/');
//   }


const User = () => {
  return (
    <div id="page-user">
        <header>
          <img src={logo} alt="logo"/>

          <Link to='/'>
            <FiArrowLeft />
            Voltar para Home
          </Link>
        </header>

        <main >
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
        </main>
    </div>
  )
};

export default User;