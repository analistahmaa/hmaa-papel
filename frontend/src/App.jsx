// Não precisa mais importar BrowserRouter aqui
import { Routes, Route } from 'react-router-dom'; 

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Login from './pages/Login';
import VerLancamentos from './pages/VerLancamentos';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    // O BrowserRouter FOI REMOVIDO DAQUI
    <Routes>
      {!isLoggedIn ? (
        <Route path="*" element={<Login />} />
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastrar" element={<Cadastrar />} />
          <Route path="usuarios" element={<GerenciarUsuarios />} />
          <Route path="lancamentos" element={<div>Página de Lançamentos em Construção</div>} />
          <Route path="relatorios" element={<div>Página de Relatórios em Construção</div>} />
          <Route path="usuarios" element={<GerenciarUsuarios />} />
          <Route path="lancamentos" element={<VerLancamentos />} />
        </Route>
      )}
    </Routes>
    // Fim do componente, sem </BrowserRouter>
  );
}

export default App;