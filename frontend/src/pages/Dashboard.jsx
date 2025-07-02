import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Layers, Assessment, History } from '@mui/icons-material'; // Ícones
import axios from 'axios';

// Componente reutilizável para os cards de estatísticas
const StatCard = ({ title, value, unit, icon, color, loading, error }) => (
  <Card elevation={4} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', height: '100%' }}>
    <Box sx={{
      bgcolor: color,
      borderRadius: '50%',
      p: 2,
      mr: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {React.cloneElement(icon, { sx: { color: '#fff', fontSize: '2rem' } })}
    </Box>
    <Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
          {value}
          <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>
            {unit}
          </Typography>
        </Typography>
      )}
    </Box>
  </Card>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ totalResmasMes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Faz a chamada para a rota correta e padronizada
      const response = await axios.get('/api/relatorios/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      const errorMessage = err.response?.data?.message || "Não foi possível carregar os dados.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard de Controle
      </Typography>

      <Grid container spacing={3}>
        {/* Card de Total de Resmas */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Geral no Mês"
            value={dashboardData.totalResmasMes}
            unit="resmas"
            icon={<Layers />}
            color="#3f51b5" // Azul primário
            loading={loading}
            error={error} // Passa o erro para o card
          />
        </Grid>

        {/* Card de Total por Setor (Placeholder) */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total por Setor"
            value="..."
            unit="(em breve)"
            icon={<Assessment />}
            color="#f57c00" // Laranja
            loading={true} // Mantemos como loading para indicar que está em desenvolvimento
          />
        </Grid>

        {/* Card de Últimos Lançamentos (Placeholder) */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Últimos Lançamentos"
            value="..."
            unit="(em breve)"
            icon={<History />}
            color="#43a047" // Verde
            loading={true} // Mantemos como loading para indicar que está em desenvolvimento
          />
        </Grid>
      </Grid>
      
      <Box mt={5}>
         <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
           Análise Detalhada
         </Typography>
         <Card elevation={4} sx={{ p: 2, borderRadius: '12px' }}>
           <CardContent>
             <Typography color="text.secondary">
               (Gráficos e outras visualizações de dados serão implementados aqui)
             </Typography>
           </CardContent>
         </Card>
      </Box>

    </Box>
  );
}

export default Dashboard;