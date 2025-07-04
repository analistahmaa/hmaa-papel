import React, { useState, useEffect } from 'react'; // <-- IMPORT MOVIDO PARA CIMA
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Button } from '@mui/material';

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
          {/* Renderização condicional para o link de admin */}
          {usuario?.tipo === 'admin' && (
             <Tab label="Gerenciar Usuários" value="/usuarios" to="/usuarios" component={Link} />
          )}
        </Tabs>
      </Box>

      {/* 3. Conteúdo Principal da Página */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f4f6f8'
        }}
      >
        <Outlet /> {/* Onde as páginas são renderizadas */}
      </Box>

    </Box>
  );
}

// A linha de import que estava aqui embaixo foi movida para o topo.

export default Layout;