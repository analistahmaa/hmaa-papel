import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver'; // npm install file-saver

// Componente reutilizável para os cards de relatório
const ReportCard = ({ title, description, onGenerate, loading }) => (
  <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
    <CardContent>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
      <Button
        variant="contained"
        color="secondary"
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
  const [loadingReport, setLoadingReport] = useState(null); // Armazena o nome do relatório em carregamento

  const handleGenerateReport = async (reportType) => {
    setLoadingReport(reportType);
    
    let url = '';
    let defaultFilename = 'relatorio.pdf';

    switch(reportType) {
      case 'totalPorSetor':
        // A URL agora aponta para a rota de geração de PDF
        url = '/api/relatorios/por-setor/pdf'; 
        defaultFilename = `Relatorio_Por_Setor_${new Date().toISOString().slice(0,10)}.pdf`;
        break;
      // Adicionar outros casos para os outros relatórios aqui
      // case 'consumoPorResponsavel': ...
      default:
        console.error('Tipo de relatório desconhecido');
        setLoadingReport(null);
        return;
    }

    try {
      const response = await axios.get(url, {
        responseType: 'blob', // MUITO IMPORTANTE: para receber o arquivo como dados binários
      });

      // Usa file-saver para iniciar o download
      saveAs(new Blob([response.data]), defaultFilename);

    } catch (error) {
      console.error(`Erro ao gerar o relatório ${reportType}:`, error);
      // Aqui você pode adicionar um snackbar de erro
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

      <Grid container spacing={3}>
        {/* Card: Total por Setor no Mês */}
        <Grid item xs={12} md={6} lg={4}>
          <ReportCard
            title="Total por Setor no Mês"
            description="Gera um relatório PDF consolidado com o total de resmas consumidas por cada setor no mês atual."
            onGenerate={() => handleGenerateReport('totalPorSetor')}
            loading={loadingReport === 'totalPorSetor'}
          />
        </Grid>

        {/* Card: Consumo por Responsável (Placeholder) */}
        <Grid item xs={12} md={6} lg={4}>
          <ReportCard
            title="Consumo por Responsável"
            description="Detalha todos os lançamentos realizados por um responsável específico em um período."
            onGenerate={() => alert('Funcionalidade em desenvolvimento!')}
            loading={false}
          />
        </Grid>

        {/* Card: Gasto Total do Hospital (Placeholder) */}
        <Grid item xs={12} md={6} lg={4}>
          <ReportCard
            title="Gasto Total do Hospital"
            description="Exibe um resumo do consumo total de resmas do hospital, mês a mês."
            onGenerate={() => alert('Funcionalidade em desenvolvimento!')}
            loading={false}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Relatorios;