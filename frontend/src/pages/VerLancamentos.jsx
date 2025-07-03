// frontend/src/pages/VerLancamentos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert, TextField, Grid, Button, MenuItem 
} from '@mui/material';
import { PictureAsPdf as PdfIcon, Description as ExcelIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

function VerLancamentos() {
  const [lancamentos, setLancamentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para os filtros
  const [filters, setFilters] = useState({
    setor_id: '',
    responsavel: '',
    data_inicio: '',
    data_fim: '',
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchLancamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Filtra apenas os parâmetros que têm valor
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      const params = new URLSearchParams(activeFilters).toString();
      const response = await axios.get(`/api/registros?${params}`);
      setLancamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
      setError("Não foi possível carregar os lançamentos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Busca os dados iniciais
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };
    fetchSetores();
    fetchLancamentos();
  }, [fetchLancamentos]);

  // Função para o botão de busca
  const handleSearch = () => {
    fetchLancamentos();
  };

  // --- NOVA FUNÇÃO PARA EXPORTAÇÃO ---
  const handleExport = (format) => {
    // Filtra apenas os parâmetros que têm valor para a URL de exportação
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(activeFilters).toString();
    const url = `/api/export/${format}?${params}`;
    
    // Abre a URL em uma nova aba, o que força o download
    window.open(url, '_blank');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Consultar Lançamentos
      </Typography>
      
      {/* --- CAMPOS DE FILTRO --- */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField select fullWidth label="Setor" name="setor_id" value={filters.setor_id} onChange={handleFilterChange} variant="outlined" size="small">
            <MenuItem value=""><em>Todos</em></MenuItem>
            {setores.map(s => <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField fullWidth label="Responsável" name="responsavel" value={filters.responsavel} onChange={handleFilterChange} variant="outlined" size="small"/>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField fullWidth label="Data Início" name="data_inicio" type="date" value={filters.data_inicio} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} variant="outlined" size="small"/>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField fullWidth label="Data Fim" name="data_fim" type="date" value={filters.data_fim} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} variant="outlined" size="small"/>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button fullWidth variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
            Buscar
          </Button>
        </Grid>
      </Grid>
      
      {/* --- NOVA SEÇÃO DE BOTÕES DE EXPORTAÇÃO --- */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<ExcelIcon />} onClick={() => handleExport('excel')} sx={{ textTransform: 'none' }}>
          Exportar para Excel
        </Button>
        <Button variant="outlined" color="error" startIcon={<PdfIcon />} onClick={() => handleExport('pdf')} sx={{ textTransform: 'none' }}>
          Exportar para PDF
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* --- TABELA DE DADOS --- */}
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="tabela de lançamentos">
          <TableHead sx={{ bgcolor: 'grey.200' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Setor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Responsável</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Resmas</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress sx={{ my: 4 }} />
                </TableCell>
              </TableRow>
            ) : (
              lancamentos.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.setor_nome}</TableCell>
                  <TableCell>{row.responsavel}</TableCell>
                  <TableCell align="right">{row.quantidade_resmas}</TableCell>
                  <TableCell align="right">{row.data_formatada}</TableCell>
                </TableRow>
              ))
            )}
            {!loading && lancamentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  Nenhum lançamento encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default VerLancamentos;