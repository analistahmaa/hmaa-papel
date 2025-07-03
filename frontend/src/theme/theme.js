// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul mais vibrante
    },
    secondary: {
      main: '#dc004e', // Um tom de rosa/vermelho para destaque
    },
    success: {
      main: '#4caf50', // Verde padrão
    },
    warning: {
      main: '#ff9800', // Laranja padrão
    },
    info: {
      main: '#2196f3', // Azul claro
    },
    error: {
      main: '#f44336', // Vermelho padrão
    },
    background: {
      default: '#f4f6f8', // Um cinza bem claro para o fundo
      paper: '#ffffff', // Branco para cards
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Ou outra fonte como 'Poppins', 'Inter'
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra mais suave
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
