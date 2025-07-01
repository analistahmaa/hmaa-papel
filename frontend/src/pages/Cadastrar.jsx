import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Grid, TextField, Button, Box, CircularProgress, Snackbar, Alert, MenuItem, Typography } from '@mui/material';
import axios from 'axios';

function Cadastrar() {
  const [setores, setSetores] = useState([]);
  const [loadingSetores, setLoadingSetores] = useState(true); // <-- Novo estado para controlar o carregamento dos setores
  const [formData, setFormData] = useState({
    setor_id: '',
    responsavel: '',
    quantidade_resmas: '',
    data: new Date().toISOString().split('T')[0],
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSetores = async () => {
      setLoadingSetores(true); // <-- Inicia o carregamento
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSnackbar({ open: true, message: 'Não foi possível carregar a lista de setores.', severity: 'error' });
      } finally {
        setLoadingSetores(false); // <-- Finaliza o carregamento
      }
    };
    fetchSetores();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await axios.post('/api/registros', formData);
      setSnackbar({ open: true, message: 'Lançamento salvo com sucesso!', severity: 'success' });
      setFormData({ ...formData, setor_id: '', responsavel: '', quantidade_resmas: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao salvar o lançamento.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Card elevation={3}>
        <CardHeader title="Cadastrar Novo Lançamento" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                {/* ===== CAMPO DE SETOR CORRIGIDO ===== */}
                <TextField
                  id="setor_id"
                  select
                  fullWidth
                  required
                  label="Setor"
                  name="setor_id"
                  value={formData.setor_id}
                  onChange={handleChange}
                  disabled={loadingSetores} // Desabilita enquanto carrega
                  SelectProps={{
                    displayEmpty: true,
                  }}
                >
                  {/* Item que aparece como placeholder */}
                  <MenuItem value="" disabled>
                    <em>{loadingSetores ? 'Carregando setores...' : 'Selecione um setor'}</em>
                  </MenuItem>
                  
                  {/* Mapeia e exibe os setores carregados */}
                  {setores.map((setor) => (
                    <MenuItem key={setor.id} value={setor.id}>
                      {setor.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField required fullWidth id="responsavel" label="Nome do Responsável" name="responsavel" value={formData.responsavel} onChange={handleChange}/>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField required fullWidth id="quantidade_resmas" label="Quantidade de Resmas" name="quantidade_resmas" type="number" value={formData.quantidade_resmas} onChange={handleChange} InputProps={{ inputProps: { min: 1 } }} />
              </Grid>

              <Grid item xs={12}>
                <TextField required fullWidth id="data" label="Data do Lançamento" name="data" type="date" value={formData.data} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained" disabled={loadingSubmit || loadingSetores}>
                {loadingSubmit ? <CircularProgress size={24} /> : 'Salvar Lançamento'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Cadastrar;