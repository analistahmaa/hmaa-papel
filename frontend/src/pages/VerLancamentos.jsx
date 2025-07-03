// frontend/src/pages/VerLancamentos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert, TextField, Grid, Button, MenuItem 
} from '@mui/material';
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
      // Constrói os parâmetros da query string a partir do estado dos filtros
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/registros?${params}`);
      setLancamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
      setError("Não foi possível carregar os lançamentos.");
    } finally {
      setLoading(false);
    }
  }, [filters]); // Refaz a busca quando os filtros mudam

  // Busca os setores para o <select> do filtro
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
    fetchLancamentos(); // Carga inicial dos lançamentos
  }, [fetchLancamentos]);

  const handleSearch = () => {
    fetchLancamentos();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Consultar Lançamentos
      </Typography>
      
      {/* --- CAMPOS DE FILTRO --- */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* --- TABELA DE DADOS --- */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de lançamentos">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Setor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Responsável</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Resmas</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Data</TableCell>
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
                <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f7f7f7' } }}>
                  <TableCell component="th" scope="row">{row.setor_nome}</TableCell>
                  <TableCell>{row.responsavel}</TableCell>
                  <TableCell align="right">{row.quantidade_resmas}</TableCell>
                  <TableCell align="right">{row.data_formatada}</TableCell>
                </TableRow>
              ))
            )}
            {!loading && lancamentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum lançamento encontrado para os filtros selecionados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default VerLancamentos;