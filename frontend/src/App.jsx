import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Login from './pages/Login'; // <-- IMPORTAR

function App() {
  // Verifica se o usuário está logado lendo o token do localStorage
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Se o usuário NÃO estiver logado, a única rota é a de login */}
        {!isLoggedIn ? (
          <Route path="*" element={<Login />} />
        ) : (
          /* Se estiver logado, mostra as rotas protegidas dentro do Layout */
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="cadastrar" element={<Cadastrar />} />
            <Route path="usuarios" element={<GerenciarUsuarios />} />
            {/* Adicione outras rotas protegidas aqui */}
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;