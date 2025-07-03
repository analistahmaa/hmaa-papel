// frontend/src/pages/Relatorios.jsx

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

// Componente reutilizável para cada card de relatório
const RelatorioCard = ({ title, description }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardHeader title={title} />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />} 
          disabled // Desabilitado por enquanto
        >
          Gerar Relatório
        </Button>
      </Box>
    </CardContent>
  </Card>
);

function Relatorios() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Central de Relatórios
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <RelatorioCard
            title="Total por Setor no Mês"
            description="Gera um relatório consolidado com o total de resmas consumidas por cada setor no mês atual."
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <RelatorioCard
            title="Consumo por Responsável"
            description="Detalha todos os lançamentos realizados por um responsável específico em um período."
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <RelatorioCard
            title="Gasto Total do Hospital"
            description="Exibe um resumo do consumo total de resmas do hospital, mês a mês."
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Relatorios;