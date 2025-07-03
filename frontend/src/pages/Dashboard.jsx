import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, CardHeader, Typography, Box, 
  CircularProgress, Alert, List, ListItem, ListItemText, Divider 
} from '@mui/material';
import { Layers, Assessment, History } from '@mui/icons-material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// --- COMPONENTES DE CARD ---

const StatCard = ({ title, value, unit, IconComponent, color, loading, error }) => (
    <Card elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '12px' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ bgcolor: color, borderRadius: '50%', p: 2, mr: 2, display: 'flex' }}>
          <IconComponent sx={{ color: '#fff', fontSize: '2rem' }} />
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">{title}</Typography>
          {loading ? <CircularProgress size={24} /> : error ? <Typography variant="body1" color="error">{error}</Typography> : <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>{value} <Typography variant="h6" component="span" color="text.secondary">{unit}</Typography></Typography>}
        </Box>
      </CardContent>
    </Card>
);

const ConsumoPorSetorChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/relatorios/total-por-setor')
      .then(response => {
        // Pega os top 5 e garante que o total é um número
        const formattedData = response.data.slice(0, 5).map(item => ({
          ...item,
          total_resmas: Number(item.total_resmas) || 0,
        }));
        setData(formattedData);
      })
      .catch(error => console.error("Erro no gráfico:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    // O Card agora tem flexbox para esticar o conteúdo
    <Card elevation={4} sx={{ 
      height: '100%', 
      borderRadius: '12px', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <CardHeader 
        title="Top 5 Consumo por Setor (Mês)" 
        titleTypographyProps={{ fontWeight: 'bold' }} 
        avatar={<Box sx={{ bgcolor: '#f57c00', borderRadius: '50%', p: 1, display: 'flex' }}><Assessment sx={{ color: '#fff' }} /></Box>} 
      />
      {/* O CardContent agora cresce para preencher o espaço vertical */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress color="warning" />
          </Box>
        ) : (
          // O ResponsiveContainer agora vai ocupar todo o espaço do CardContent
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="nome" 
                width={150} 
                tick={{ fontSize: 12, fill: '#555' }} 
                interval={0} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: '#f5f5f5'}} 
                formatter={(value) => [`${value} resmas`, 'Total']} 
                contentStyle={{ borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="total_resmas" fill="#ff9800" barSize={30} radius={[0, 8, 8, 0]}>
                <LabelList dataKey="total_resmas" position="right" style={{ fill: 'black', fontSize: '14px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const UltimosLancamentosCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/relatorios/ultimos-lancamentos')
      .then(response => setData(response.data))
      .catch(error => console.error("Erro nos últimos lançamentos:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card elevation={4} sx={{ height: '100%', borderRadius: '12px' }}>
      <CardHeader title="Últimos 5 Lançamentos" titleTypographyProps={{ fontWeight: 'bold' }} avatar={<Box sx={{ bgcolor: '#43a047', borderRadius: '50%', p: 1, display: 'flex' }}><History sx={{ color: '#fff' }} /></Box>} />
      <CardContent>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}><CircularProgress color="success" /></Box> :
          <List dense>
            {data.length > 0 ? data.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText primary={item.setor_nome} secondary={`Em: ${item.data_formatada}`} />
                </ListItem>
                {index < data.length - 1 && <Divider />}
              </React.Fragment>
            )) : <Typography color="text.secondary">Nenhum lançamento recente.</Typography>}
          </List>
        }
      </CardContent>
    </Card>
  );
};


// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
function Dashboard() {
  const [totalGeralData, setTotalGeralData] = useState({ totalResmasMes: 0 });
  const [loadingTotalGeral, setLoadingTotalGeral] = useState(true);
  const [errorTotalGeral, setErrorTotalGeral] = useState(null);

  useEffect(() => {
    axios.get('/api/relatorios/dashboard')
      .then(response => setTotalGeralData(response.data))
      .catch(err => setErrorTotalGeral(err.response?.data?.message || "Falha ao carregar."))
      .finally(() => setLoadingTotalGeral(false));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard de Controle
      </Typography>
      
      {/* Grid com alinhamento e distribuição de espaço aprimorados */}
      <Grid container spacing={4} alignItems="stretch">
        {/* Coluna da Esquerda (ocupa 1/3 em telas grandes) */}
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <StatCard
                title="Total Geral no Mês"
                value={totalGeralData.totalResmasMes}
                unit="resmas"
                IconComponent={Layers}
                color="#3f51b5"
                loading={loadingTotalGeral}
                error={errorTotalGeral}
              />
            </Grid>
            <Grid item>
              <UltimosLancamentosCard />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Coluna da Direita (ocupa 2/3 em telas grandes) */}
        <Grid item xs={12} md={8}>
          <ConsumoPorSetorChart />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;