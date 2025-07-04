import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

// --- PÁGINAS E COMPONENTES ---
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Login from './pages/Login';
import VerLancamentos from './pages/VerLancamentos';
import Relatorios from './pages/Relatorios';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    // O LocalizationProvider pode ficar aqui, envolvendo a lógica principal.
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        {/* O Routes é o responsável por decidir qual página mostrar. */}
        <Routes>
          {!isLoggedIn ? (
            <Route path="*" element={<Login />} />
          ) : (
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="cadastrar" element={<Cadastrar />} />
              <Route path="usuarios" element={<GerenciarUsuarios />} />
              <Route path="lancamentos" element={<VerLancamentos />} />
              <Route path="relatorios" element={<Relatorios />} />
            </Route>
          )}
        </Routes>
    </LocalizationProvider>
  );
}

export default App;