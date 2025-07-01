// frontend/src/pages/Cadastrar.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Grid, TextField, Button, Box, CircularProgress, Snackbar, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

// Lista de setores - idealmente viria do banco de dados no futuro
const setores = ["UTI", "Clínica Médica", "Centro Cirúrgico", "Pronto Socorro", "Administração"];

function Cadastrar() {
  const [formData, setFormData] = useState({
    setor: '',
    quantidade: '',
    data: new Date().toISOString().split('T')[0], // Pega a data de hoje no formato YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/registros', formData);
      setSnackbar({ open: true, message: 'Lançamento salvo com sucesso!', severity: 'success' });
      // Limpa o formulário, mas mantém a data
      setFormData({ ...formData, setor: '', quantidade: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao salvar o lançamento.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      console.error("Erro no formulário de cadastro:", error);
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
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  fullWidth
                  id="setor"
                  label="Setor"
                  name="setor"
                  value={formData.setor}
                  onChange={handleChange}
                >
                  {setores.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="quantidade"
                  label="Quantidade de Folhas"
                  name="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="data"
                  label="Data do Lançamento"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar Lançamento'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Componente de notificação (Snackbar) */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Cadastrar;