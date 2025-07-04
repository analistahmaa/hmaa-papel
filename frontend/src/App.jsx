// frontend/src/App.jsx

// --- IMPORTS DAS BIBLIOTECAS DE ROTEAMENTO E DATAS ---
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale'; // Para o calendário e formatos em português

// --- IMPORTS DOS SEUS COMPONENTES E PÁGINAS ---
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Login from './pages/Login';
import VerLancamentos from './pages/VerLancamentos';
import Relatorios from './pages/Relatorios';

function App() {
  // Verifica se o usuário está logado lendo o token do localStorage
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    // 1. O LocalizationProvider envolve tudo para que os DatePickers funcionem em qualquer lugar da aplicação.
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      
      {/* 2. O BrowserRouter gerencia todo o roteamento da aplicação. */}
      <BrowserRouter>

        {/* 3. O Routes decide qual rota/página mostrar com base na URL. */}
        <Routes>
          
          {/* Lógica de Rota: Se o usuário NÃO estiver logado... */}
          {!isLoggedIn ? (
            // ...qualquer URL digitada levará para a página de Login.
            <Route path="*" element={<Login />} />
          ) : (
            /* Se o usuário ESTIVER logado... */
            // ...renderiza o Layout principal, que contém o menu e o cabeçalho.
            <Route path="/" element={<Layout />}>
              {/* As rotas abaixo são "filhas" do Layout e serão renderizadas dentro dele. */}
              <Route index element={<Dashboard />} /> {/* Página inicial (/) */}
              <Route path="cadastrar" element={<Cadastrar />} />
              <Route path="usuarios" element={<GerenciarUsuarios />} />
              <Route path="lancamentos" element={<VerLancamentos />} />
              <Route path="relatorios" element={<Relatorios />} />
            </Route>
          )}
        </Routes>
        
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;