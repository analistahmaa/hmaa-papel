import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, CardHeader, Typography, Box, 
  CircularProgress, Alert, LinearProgress, List, ListItem, ListItemText 
} from '@mui/material';
import { Layers, Assessment, History } from '@mui/icons-material';
import axios from 'axios';

// --- COMPONENTES DE CARD ---

// Componente para cards simples de estatística (Total Geral)
const StatCard = ({ title, value, unit, icon, color, loading, error }) => (
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

// Componente para o card de "Total por Setor"
const TotalPorSetorCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/relatorios/total-por-setor');
        setData(response.data);
      } catch (err) {
        setError("Falha ao carregar.");
        console.error("Erro no card TotalPorSetor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card elevation={4} sx={{ height: '100%', borderRadius: '12px' }}>
      <CardHeader
        avatar={
          <Box sx={{ bgcolor: '#f57c00', borderRadius: '50%', p: 1, display: 'flex' }}>
            <Assessment sx={{ color: '#fff' }} />
          </Box>
        }
        title="Consumo por Setor (Mês)"
        titleTypographyProps={{ fontWeight: 'bold' }}
      />
      <CardContent sx={{ pt: 0 }}>
        {loading && <LinearProgress color="warning" />}
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {!loading && !error && (
          data.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>Nenhum lançamento no mês.</Typography>
          ) : (
            <List dense sx={{ p: 0 }}>
              {data.slice(0, 5).map((item) => ( // Mostra o Top 5
                <ListItem key={item.nome} disablePadding>
                  <ListItemText
                    primary={item.nome}
                    secondary={`${item.total_resmas} resmas`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          )
        )}
      </CardContent>
    </Card>
  );
};


// --- COMPONENTE PRINCIPAL DO DASHBOARD ---

function Dashboard() {
  const [totalGeralData, setTotalGeralData] = useState({ totalResmasMes: 0 });
  const [loadingTotalGeral, setLoadingTotalGeral] = useState(true);
  const [errorTotalGeral, setErrorTotalGeral] = useState(null);

  // useEffect para o card "Total Geral no Mês"
  useEffect(() => {
    const fetchTotalGeralData = async () => {
      setLoadingTotalGeral(true);
      setErrorTotalGeral(null);
      try {
        const response = await axios.get('/api/relatorios/dashboard');
        setTotalGeralData(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        const errorMessage = err.response?.data?.message || "Não foi possível carregar os dados.";
        setErrorTotalGeral(errorMessage);
      } finally {
        setLoadingTotalGeral(false);
      }
    };
    fetchTotalGeralData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard de Controle
      </Typography>
      
      <Grid container spacing={3}>
        {/* --- Card 1: Total Geral no Mês --- */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Geral no Mês"
            value={totalGeralData.totalResmasMes}
            unit="resmas"
            icon={<Layers />}
            color="#3f51b5"
            loading={loadingTotalGeral}
            error={errorTotalGeral}
          />
        </Grid>
        
        {/* --- Card 2: Total por Setor --- */}
        <Grid item xs={12} sm={6} md={4}>
          <TotalPorSetorCard />
        </Grid>
        
        {/* --- Card 3: Últimos Lançamentos (Placeholder) --- */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Últimos Lançamentos"
            value="..."
            unit="(em breve)"
            icon={<History />}
            color="#43a047"
            loading={true} // Mantemos como loading para indicar que está em desenvolvimento
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;