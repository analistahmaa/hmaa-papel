// frontend/src/pages/Cadastrar.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Grid, TextField, Button, Box, CircularProgress, Snackbar, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

function Cadastrar() {
  const [setores, setSetores] = useState([]); // Armazena a lista de setores da API
  const [formData, setFormData] = useState({
    setor_id: '', // Agora vamos enviar o ID do setor
    responsavel: '',
    quantidade_resmas: '',
    data: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Busca os setores da API quando o componente é montado
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('/api/setores');
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSnackbar({ open: true, message: 'Não foi possível carregar a lista de setores.', severity: 'error' });
      }
    };
    fetchSetores();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/registros', formData);
      setSnackbar({ open: true, message: 'Lançamento salvo com sucesso!', severity: 'success' });
      setFormData({ ...formData, setor_id: '', responsavel: '', quantidade_resmas: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao salvar o lançamento.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
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
                <TextField
                  select
                  required
                  fullWidth
                  id="setor_id"
                  label="Setor"
                  name="setor_id" // O nome do campo agora é setor_id
                  value={formData.setor_id}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <MenuItem value="" disabled>Selecione um setor</MenuItem>
                  {setores.map((setor) => (
                    <MenuItem key={setor.id} value={setor.id}>{setor.nome}</MenuItem>
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
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Salvar Lançamento'}
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