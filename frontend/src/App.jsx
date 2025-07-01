// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe o Layout e as páginas
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import Listagem from './pages/Listagem';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* O Layout envolve todas as páginas */}
        <Route index element={<Dashboard />} /> {/* 'index' marca a rota padrão */}
        <Route path="cadastrar" element={<Cadastrar />} />
        <Route path="listagem" element={<Listagem />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  );
}

export default App;