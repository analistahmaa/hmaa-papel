// src/App.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Para resetar o CSS padrão
import theme from './theme'; // Importe seu tema
import Dashboard from './Dashboard'; // Seu componente Dashboard

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Aplica um reset de CSS */}
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
