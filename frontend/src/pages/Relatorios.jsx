import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, TextField, MenuItem } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver';

// ==========================================================
// === DEFINIÇÃO DO COMPONENTE QUE ESTAVA FALTANDO ===
// ==========================================================
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
// ==========================================================

function Relatorios() {
  const [loadingReport, setLoadingReport] = useState(null);
  const [filters, setFilters] = useState({
    data_inicio: '',
    data_fim: '',
    setor_id: '',
  });
  const [setores, setSetores] = useState([]);

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (err) {
        console.error("Erro ao buscar setores para o filtro:", err);
      }
    };
    fetchSetores();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async (reportType) => {
    if (!filters.data_inicio || !filters.data_fim) {
      alert('Por favor, selecione a data de início e a data de fim.');
      return;
    }
    setLoadingReport(reportType);
    
    let url = '';
    let defaultFilename = 'relatorio.pdf';
    let params = {
      data_inicio: filters.data_inicio,
      data_fim: filters.data_fim,
    };

    switch(reportType) {
      case 'totalPorSetor':
        url = '/api/relatorios/por-setor/pdf';
        defaultFilename = `Relatorio_Setor_${filters.data_inicio}_a_${filters.data_fim}.pdf`;
        if (filters.setor_id) {
          params.setor_id = filters.setor_id;
        }
        break;
      case 'gastoTotal':
        url = '/api/relatorios/gasto-total/pdf';
        defaultFilename = `Gasto_Total_${filters.data_inicio}_a_${filters.data_fim}.pdf`;
        break;
      default:
        setLoadingReport(null);
        return;
    }

    try {
      const response = await axios.get(url, { params, responseType: 'blob' });
      saveAs(new Blob([response.data]), defaultFilename);
    } catch (error) {
      console.error(`Erro ao gerar o relatório ${reportType}:`, error);
      alert('Não foi possível gerar o relatório. Verifique se existem dados para os filtros selecionados.');
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="date" label="Data Início" name="data_inicio" value={filters.data_inicio} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="date" label="Data Fim" name="data_fim" value={filters.data_fim} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select fullWidth label="Setor (Opcional)" name="setor_id" value={filters.setor_id} onChange={handleFilterChange}>
              <MenuItem value=""><em>Todos os Setores</em></MenuItem>
              {setores.map(setor => <MenuItem key={setor.id} value={setor.id}>{setor.nome}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Agora o <ReportCard /> existe e pode ser usado */}
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Total por Setor"
            description="Gera um relatório PDF com o total de resmas por setor. Se nenhum setor for selecionado, mostra todos."
            onGenerate={() => handleGenerateReport('totalPorSetor')}
            loading={loadingReport === 'totalPorSetor'}
          />
        </Grid>
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