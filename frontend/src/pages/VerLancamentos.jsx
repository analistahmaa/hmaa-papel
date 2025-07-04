import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns'; // npm install date-fns

function VerLancamentos() {
  // Estado para os filtros
  const [filters, setFilters] = useState({
    setor_id: '',
    responsavel: '',
    data_inicio: '',
    data_fim: '',
  });
  
  // Estado para a lista de setores do dropdown
  const [setores, setSetores] = useState([]);

  // Estado para os resultados da busca
  const [lancamentos, setLancamentos] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Para saber se uma busca já foi feita
  const [error, setError] = useState(null);

  // Carrega a lista de setores quando o componente monta
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (err) {
        console.error("Erro ao buscar setores:", err);
      }
    };
    fetchSetores();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setError(null);
    setLancamentos([]);

    try {
      const response = await axios.get('/api/registros', { params: filters });
      setLancamentos(response.data);
    } catch (err) {
      setError("Falha ao buscar lançamentos. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Consultar Lançamentos
      </Typography>

      {/* Card de Filtros */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField select fullWidth label="Setor" name="setor_id" value={filters.setor_id} onChange={handleFilterChange}>
                <MenuItem value=""><em>Todos</em></MenuItem>
                {setores.map(setor => <MenuItem key={setor.id} value={setor.id}>{setor.nome}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Responsável" name="responsavel" value={filters.responsavel} onChange={handleFilterChange} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth type="date" label="Data Início" name="data_inicio" value={filters.data_inicio} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth type="date" label="Data Fim" name="data_fim" value={filters.data_fim} onChange={handleFilterChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} disabled={loading} sx={{ height: '56px' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Área de Resultados */}
      {error && <Alert severity="error">{error}</Alert>}
      
      {searched && !loading && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Setor</TableCell>
                  <TableCell>Responsável</TableCell>
                  <TableCell align="center">Quantidade (Resmas)</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lancamentos.length > 0 ? (
                  lancamentos.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.setor_nome}</TableCell>
                      <TableCell>{row.responsavel}</TableCell>
                      <TableCell align="center">{row.quantidade_resmas}</TableCell>
                      <TableCell align="right">{format(new Date(row.data), 'dd/MM/yyyy')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum resultado encontrado para os filtros informados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default VerLancamentos;