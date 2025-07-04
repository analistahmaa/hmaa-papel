import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, TextField, MenuItem } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver';

// ... (o componente ReportCard continua o mesmo)

function Relatorios() {
  const [loadingReport, setLoadingReport] = useState(null);
  const [filters, setFilters] = useState({
    data_inicio: '',
    data_fim: '',
    setor_id: '', // Novo estado para o filtro de setor
  });
  const [setores, setSetores] = useState([]); // Para popular o dropdown

  // Carrega a lista de setores
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
        // Adiciona o setor_id aos parâmetros SOMENTE se ele for selecionado
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

      {/* Card de Filtros */}
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
        {/* Card: Total por Setor */}
        <Grid item xs={12} md={6}>
          <ReportCard
            title="Total por Setor"
            description="Gera um relatório PDF com o total de resmas por setor. Se nenhum setor for selecionado, mostra todos."
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