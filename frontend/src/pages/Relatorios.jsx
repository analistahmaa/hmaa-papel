import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, TextField } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Componente reutilizável para os cards de relatório
const ReportCard = ({ title, description, onGenerate, loading, children }) => (
  <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
      <Box mt={2}>{children}</Box> {/* Área para os filtros */}
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? 'Gerando...' : 'Gerar Relatório'}
      </Button>
    </CardActions>
  </Card>
);

function Relatorios() {
  const [loadingReport, setLoadingReport] = useState(null);
  const [dates, setDates] = useState({ data_inicio: '', data_fim: '' });

  const handleDateChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async (reportType) => {
    if (!dates.data_inicio || !dates.data_fim) {
      alert('Por favor, selecione a data de início e a data de fim.');
      return;
    }
    setLoadingReport(reportType);
    
    let url = '';
    let defaultFilename = 'relatorio.pdf';

    switch(reportType) {
      case 'totalPorSetor':
        url = '/api/relatorios/por-setor/pdf';
        defaultFilename = `Relatorio_Setor_${dates.data_inicio}_a_${dates.data_fim}.pdf`;
        break;
      case 'gastoTotal':
        url = '/api/relatorios/gasto-total/pdf';
        defaultFilename = `Gasto_Total_${dates.data_inicio}_a_${dates.data_fim}.pdf`;
        break;
      default:
        setLoadingReport(null);
        return;
    }

    try {
      const response = await axios.get(url, {
        params: { data_inicio: dates.data_inicio, data_fim: dates.data_fim },
        responseType: 'blob',
      });
      saveAs(new Blob([response.data]), defaultFilename);
    } catch (error) {
      console.error(`Erro ao gerar o relatório ${reportType}:`, error);
      alert('Não foi possível gerar o relatório. Verifique se existem dados no período selecionado.');
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Central de Relatórios
      </Typography>

      {/* Seletor de Período Global */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>Selecione o Período</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Data Início" name="data_inicio" value={dates.data_inicio} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Data Fim" name="data_fim" value={dates.data_fim} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Card: Total por Setor */}
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Total por Setor"
            description="Gera um relatório PDF consolidado com o total de resmas consumidas por cada setor no período selecionado."
            onGenerate={() => handleGenerateReport('totalPorSetor')}
            loading={loadingReport === 'totalPorSetor'}
          />
        </Grid>

        {/* Card: Gasto Total do Hospital */}
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Gasto Total do Hospital"
            description="Exibe um resumo do consumo total de resmas do hospital no período selecionado."
            onGenerate={() => handleGenerateReport('gastoTotal')}
            loading={loadingReport === 'gastoTotal'}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Relatorios;