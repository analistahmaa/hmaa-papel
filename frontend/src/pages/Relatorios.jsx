import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, TextField, MenuItem } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Novo DatePicker
import axios from 'axios';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// ... (O componente ReportCard continua o mesmo)
const ReportCard = ({ title, description, onGenerate, loading }) => (
  <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
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
  const [filters, setFilters] = useState({
    data_inicio: null, // Agora começa como null para o DatePicker
    data_fim: null,    // Agora começa como null para o DatePicker
    setor_id: '',
  });
  const [setores, setSetores] = useState([]);

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (err) { console.error("Erro ao buscar setores:", err); }
    };
    fetchSetores();
  }, []);

  const handleGenerateReport = async (reportType) => {
    // Validação
    if (!filters.data_inicio || !filters.data_fim) {
      alert('Por favor, selecione a data de início e a data de fim.');
      return;
    }
    setLoadingReport(reportType);
    
    // Formata as datas para o formato YYYY-MM-DD que o backend espera
    const formattedParams = {
      data_inicio: format(filters.data_inicio, 'yyyy-MM-dd'),
      data_fim: format(filters.data_fim, 'yyyy-MM-dd'),
    };
    
    let url = '';
    let defaultFilename = 'relatorio.pdf';

    switch(reportType) {
      case 'totalPorSetor':
        url = '/api/relatorios/por-setor/pdf';
        defaultFilename = `Relatorio_Setor_${formattedParams.data_inicio}_a_${formattedParams.data_fim}.pdf`;
        if (filters.setor_id) {
          formattedParams.setor_id = filters.setor_id;
        }
        break;
      case 'gastoTotal':
        url = '/api/relatorios/gasto-total/pdf';
        defaultFilename = `Gasto_Total_${formattedParams.data_inicio}_a_${formattedParams.data_fim}.pdf`;
        break;
      default:
        setLoadingReport(null);
        return;
    }

    try {
      const response = await axios.get(url, { params: formattedParams, responseType: 'blob' });
      saveAs(new Blob([response.data]), defaultFilename);
    } catch (error) {
      console.error(`Erro ao gerar o relatório ${reportType}:`, error);
      alert('Não foi possível gerar o relatório.');
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Central de Relatórios
      </Typography>

      <Card sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>Selecione os Filtros</Typography>
        {/* GRID CORRIGIDO */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Data Início"
              value={filters.data_inicio}
              onChange={(newValue) => setFilters(prev => ({ ...prev, data_inicio: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Data Fim"
              value={filters.data_fim}
              onChange={(newValue) => setFilters(prev => ({ ...prev, data_fim: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Setor (Opcional)"
              name="setor_id"
              value={filters.setor_id}
              onChange={(e) => setFilters(prev => ({...prev, setor_id: e.target.value}))}
            >
              <MenuItem value=""><em>Todos os Setores</em></MenuItem>
              {setores.map(setor => <MenuItem key={setor.id} value={setor.id}>{setor.nome}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Total por Setor"
            description="Gera um relatório PDF com o total de resmas por setor no período."
            onGenerate={() => handleGenerateReport('totalPorSetor')}
            loading={loadingReport === 'totalPorSetor'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Gasto Total do Hospital"
            description="Exibe um resumo do consumo total de resmas do hospital no período."
            onGenerate={() => handleGenerateReport('gastoTotal')}
            loading={loadingReport === 'gastoTotal'}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Relatorios;