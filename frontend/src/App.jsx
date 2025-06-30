import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoutesComponent from './Routes';

function App() {
  return (
    <div className="container mt-5">
      <h1>Controle de Papel HMAA</h1>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cadastro">Cadastrar</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/listagem">Listagem</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/relatorios">Relatórios</a>
            </li>
          </ul>
        </div>
      </nav>
      <RoutesComponent />
    </div>
  );
}

export default App;