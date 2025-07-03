// frontend/src/components/Layout.jsx

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Controle de Papel HMAA
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Bem-vindo(a), {user ? user.nome : 'Usuário'}
          </Typography>
          <Tooltip title="Sair do sistema">
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da AppBar */}
        
        {/* Abas de Navegação */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={location.pathname} indicatorColor="primary" textColor="primary">
            <Tab label="Dashboard" value="/" to="/" component={Link} />
            <Tab label="Cadastrar Lançamento" value="/cadastrar" to="/cadastrar" component={Link} />
            <Tab label="Ver Lançamentos" value="/lancamentos" to="/lancamentos" component={Link} />
            <Tab label="Relatórios" value="/relatorios" to="/relatorios" component={Link} />
            {/* Rota de Admin protegida visualmente */}
            {user && user.tipo === 'admin' && (
              <Tab label="Gerenciar Usuários" value="/usuarios" to="/usuarios" component={Link} />
            )}
          </Tabs>
        </Box>
        
        {/* O conteúdo da página atual será renderizado aqui */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;