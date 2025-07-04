import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Button } from '@mui/material';

// Função para pegar as iniciais do nome do usuário
const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

function Layout() {
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Pega os dados do usuário do localStorage quando o componente montar
    const usuarioData = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioData) {
      setUsuario(usuarioData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login'; // Força o redirecionamento e recarregamento
  };

  return (
    // Box principal que ocupa a tela inteira e organiza em coluna
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. AppBar/Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Controle de Papel HMAA
          </Typography>
          {usuario && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>
                Bem-vindo(a), {usuario.nome}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 2. Barra de Navegação */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={location.pathname} centered>
          <Tab label="Dashboard" value="/" to="/" component={Link} />
          <Tab label="Cadastrar Lançamento" value="/cadastrar" to="/cadastrar" component={Link} />
          <Tab label="Ver Lançamentos" value="/lancamentos" to="/lancamentos" component={Link} disabled />
          <Tab label="Relatórios" value="/relatorios" to="/relatorios" component={Link} disabled />
          {usuario?.tipo === 'admin' && (
             <Tab label="Gerenciar Usuários" value="/usuarios" to="/usuarios" component={Link} />
          )}
        </Tabs>
      </Box>

      {/* 3. Conteúdo Principal da Página */}
      {/* Este 'Box' vai crescer para ocupar todo o espaço restante */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Permite que este elemento cresça
          p: 3,        // Adiciona um padding interno
          bgcolor: '#f4f6f8' // Um fundo cinza claro para o conteúdo
        }}
      >
        <Outlet /> {/* Aqui é onde o Dashboard, Cadastrar, etc., serão renderizados */}
      </Box>

    </Box>
  );
}

// Você precisará adicionar estas importações se elas não existirem no seu Layout
import { useState, useEffect } from 'react';

export default Layout;