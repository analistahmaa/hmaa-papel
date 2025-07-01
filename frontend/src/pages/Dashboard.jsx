// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState({ totalFolhasMes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/relatorios/summary');
        setSummary(response.data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar dados.");
        console.error("Erro ao buscar summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Card: Total por Setor */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
              Total por Setor (Este Mês)
            </Typography>
            <Typography variant="body2">
              (Funcionalidade em desenvolvimento)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card: Total Geral no Mês */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
              Total Geral no Mês
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography variant="h4" component="div" sx={{ color: 'green', fontWeight: 'bold' }}>
                {summary.totalFolhasMes} folhas
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Card: Últimos Lançamentos */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
              Últimos Lançamentos
            </Typography>
            <Typography variant="body2">
              (Funcionalidade em desenvolvimento)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;