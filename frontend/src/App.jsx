import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <h1>Controle de Papel HMAA</h1>
      <nav>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('cadastrar')}>Cadastrar</button>
        <button onClick={() => setActiveTab('listagem')}>Listagem</button>
        <button onClick={() => setActiveTab('relatorios')}>Relatórios</button>
      </nav>

      {activeTab === 'dashboard' && <p>Bem-vindo ao Dashboard</p>}
      {activeTab === 'cadastrar' && <p>Formulário de cadastro</p>}
      {activeTab === 'listagem' && <p>Listagem de lançamentos</p>}
      {activeTab === 'relatorios' && <p>Relatórios disponíveis</p>}
    </div>
  );
}

export default App;