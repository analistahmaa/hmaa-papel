import React, { useState, useEffect } from 'react'; // Removido useCallback
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Layers, Assessment, History } from '@mui/icons-material';
import axios from 'axios';

// O componente StatCard continua o mesmo, não precisa mudar.
const StatCard = ({ title, value, unit, icon, color, loading, error }) => (
    // ... (código do StatCard sem alterações)
    <Card elevation={4} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', height: '100%' }}>
        <Box sx={{ bgcolor: color, borderRadius: '50%', p: 2, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.cloneElement(icon, { sx: { color: '#fff', fontSize: '2rem' } })}
        </Box>
        <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
            {loading ? <CircularProgress size={24} /> : error ? <Typography variant="body1" color="error">{error}</Typography> : <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>{value}<Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>{unit}</Typography></Typography>}
        </Box>
    </Card>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ totalResmasMes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lógica de busca de dados movida para dentro do useEffect.
  // Esta é a forma mais padrão e segura de fazer chamadas de API em componentes.
  useEffect(() => {
    // Definimos a função async DENTRO do useEffect
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/relatorios/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        const errorMessage = err.response?.data?.message || "Não foi possível carregar os dados.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData(); // Chamamos a função
  }, []); // <-- O array de dependências vazio é SEGURO aqui, pois a função só existe neste escopo.

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard de Controle
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Geral no Mês"
            value={dashboardData.totalResmasMes}
            unit="resmas"
            icon={<Layers />}
            color="#3f51b5"
            loading={loading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total por Setor"
            value="..."
            unit="(em breve)"
            icon={<Assessment />}
            color="#f57c00"
            loading={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Últimos Lançamentos"
            value="..."
            unit="(em breve)"
            icon={<History />}
            color="#43a047"
            loading={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;