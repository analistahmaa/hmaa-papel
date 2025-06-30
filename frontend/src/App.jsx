import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

// Importe as páginas que criamos
import Dashboard from './pages/Dashboard';
import Cadastrar from './pages/Cadastrar';
import Listagem from './pages/Listagem';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <div>
      {/* Barra de Navegação com Material-UI */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Controle de Papel HMAA
          </Typography>
          {/* Botões que usam o Link do React Router para navegar */}
          <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/cadastrar">Cadastrar</Button>
          <Button color="inherit" component={RouterLink} to="/listagem">Listagem</Button>
          <Button color="inherit" component={RouterLink} to="/relatorios">Relatórios</Button>
        </Toolbar>
      </AppBar>

      {/* Container para o conteúdo da página */}
      <Container sx={{ mt: 4 }}>
        <Box>
          {/* O React Router irá renderizar o componente da rota correspondente aqui */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastrar" element={<Cadastrar />} />
            <Route path="/listagem" element={<Listagem />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </Box>
      </Container>
    </div>
  );
}

export default App;