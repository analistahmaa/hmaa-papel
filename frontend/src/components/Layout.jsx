// frontend/src/components/Layout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, CssBaseline, Container } from '@mui/material';

// Definição das rotas para as abas
const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Cadastrar Lançamento', path: '/cadastrar' },
  { label: 'Ver Lançamentos', path: '/listagem' },
  { label: 'Relatórios', path: '/relatorios' },
];

function Layout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Este useEffect garante que a aba correta fique selecionada ao navegar
  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />
      
      {/* 1. BARRA SUPERIOR (APPBAR) */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Controle de Papel HMAA
          </Typography>
          <Typography variant="body1">
            Bem-vindo(a), João da Silva
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* 2. BARRA DE ABAS DE NAVEGAÇÃO */}
      <AppBar component="nav" position="static" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {navLinks.map((link) => (
              <Tab 
                key={link.label} 
                label={link.label} 
                component={RouterLink} 
                to={link.path} 
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>

      {/* 3. ÁREA DE CONTEÚDO PRINCIPAL */}
      <Box component="main" sx={{ flexGrow: 1, py: 4, px: 3 }}>
        <Container maxWidth="xl">
          {/* O conteúdo da rota (Dashboard, Cadastrar, etc.) será renderizado aqui */}
          <Outlet /> 
        </Container>
      </Box>

      {/* 4. RODAPÉ */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          backgroundColor: '#2c3e50',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Controle de Papel HMAA | Sistema desenvolvido com React.js
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout;