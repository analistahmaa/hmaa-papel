import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, CardHeader, Typography, Box, 
  CircularProgress, Alert, List, ListItem, ListItemText, Divider 
} from '@mui/material';
import { Layers, Assessment, History } from '@mui/icons-material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles'; // Importar useTheme

// --- COMPONENTES DE CARD ---

const StatCard = ({ title, value, unit, IconComponent, color, loading, error }) => {
    const theme = useTheme(); // Acessar o tema
    return (
        <Card elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: color, borderRadius: '50%', p: 2, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent sx={{ color: '#fff', fontSize: '2.5rem' }} /> {/* Ícone um pouco maior */}
            </Box>
            <Box>
              <Typography variant="subtitle1" color="text.secondary">{title}</Typography> {/* Subtitle1 para o título */}
              {loading ? <CircularProgress size={28} color="primary" /> : error ? <Typography variant="body2" color="error">{error}</Typography> : <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{value} <Typography variant="h6" component="span" color="text.secondary">{unit}</Typography></Typography>}
            </Box>
          </CardContent>
        </Card>
    );
};

const ConsumoPorSetorChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    axios.get('/api/relatorios/total-por-setor')
      .then(response => {
        // Garante que os dados são um array e que total_resmas é um número
        const processedData = response.data.slice(0, 5).map(item => ({
          ...item,
          total_resmas: Number(item.total_resmas) || 0
        }));
        setData(processedData);
      })
      .catch(error => console.error("Erro no gráfico:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        title="Top 5 Consumo por Setor (Mês)" 
        titleTypographyProps={{ fontWeight: 'bold', variant: 'h6' }} 
        avatar={<Box sx={{ bgcolor: theme.palette.warning.main, borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Assessment sx={{ color: '#fff' }} /></Box>} 
      />
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress color="warning" /></Box>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="nome" 
                width={150} 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }} 
                interval={0} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                formatter={(value) => [`${value} resmas`, 'Total']} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="total_resmas" fill={theme.palette.warning.main} barSize={25} radius={[0, 8, 8, 0]}>
                <LabelList dataKey="total_resmas" position="right" style={{ fill: theme.palette.text.primary, fontSize: '14px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Nenhum dado de consumo disponível.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const UltimosLancamentosCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme(); // Acessar o tema

  useEffect(() => {
    axios.get('/api/relatorios/ultimos-lancamentos')
      .then(response => setData(response.data))
      .catch(error => console.error("Erro nos últimos lançamentos:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card elevation={4} sx={{ height: '100%' }}>
      <CardHeader 
        title="Últimos 5 Lançamentos" 
        titleTypographyProps={{ fontWeight: 'bold', variant: 'h6' }} 
        avatar={<Box sx={{ bgcolor: theme.palette.success.main, borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><History sx={{ color: '#fff' }} /></Box>} 
      />
      <CardContent>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress color="success" /></Box> :
          <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}> {/* Adicionado scroll se muitos itens */}
            {data.length > 0 ? data.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 1 }}> {/* Mais padding vertical */}
                  <ListItemText 
                    primary={<Typography variant="body1" sx={{ fontWeight: 'medium' }}>{item.setor_nome}</Typography>} 
                    secondary={<Typography variant="body2" color="text.secondary">{`Em: ${item.data_formatada}`}</Typography>} 
                  />
                </ListItem>
                {index < data.length - 1 && <Divider component="li" />} {/* Divider como li */}
              </React.Fragment>
            )) : <Typography color="text.secondary" sx={{ p: 2 }}>Nenhum lançamento recente.</Typography>}
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
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}> {/* Fundo cinza claro */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
        Dashboard de Controle
      </Typography>
      
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6} lg={4}>
          <StatCard
            title="Total Geral no Mês"
            value={totalGeralData.totalResmasMes}
            unit="resmas"
            IconComponent={Layers}
            color="#1976d2" // Usando a cor primária do tema
            loading={loadingTotalGeral}
            error={errorTotalGeral}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <ConsumoPorSetorChart />
        </Grid>
        
        <Grid item xs={12} md={12} lg={4}>
          <UltimosLancamentosCard />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
