import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import VerLancamentos from './pages/VerLancamentos';
import Relatorios from './pages/Relatorios';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Layout from './components/Layout';

// Importações para o tema Material-UI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme'; // Certifique-se de que este caminho está correto

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Aplica um reset de CSS */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/cadastrar-lancamento" element={<Layout><Cadastrar /></Layout>} />
            <Route path="/ver-lancamentos" element={<Layout><VerLancamentos /></Layout>} />
            <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
            <Route path="/gerenciar-usuarios" element={<Layout><GerenciarUsuarios /></Layout>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;


