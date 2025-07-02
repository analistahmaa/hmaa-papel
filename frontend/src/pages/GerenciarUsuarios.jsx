import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, Grid, TextField, Button, Box,
  Select, MenuItem, InputLabel, FormControl, CircularProgress, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

function GerenciarUsuarios() {
  const [formData, setFormData] = useState({
    nome: '',
    usuario: '', // <-- Mudou de 'email' para 'usuario'
    senha: '',
    tipo: 'operador',
  });
  // ... resto da lógica (loading, snackbar) é a mesma

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // A lógica de submit é a mesma, só os dados do formulário que mudaram
    // ...
  };

  // ...

  return (
    <>
      <Card elevation={3} sx={{ maxWidth: '600px', margin: 'auto', mt: 4 }}>
        <CardHeader title="Criar Novo Usuário" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth required label="Nome Completo" name="nome" value={formData.nome} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                {/* CAMPO MODIFICADO */}
                <TextField fullWidth required label="Nome de Usuário" name="usuario" value={formData.usuario} onChange={handleChange} helperText="Ex: 'joao.s'. Este será o login." />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required type="password" label="Senha Inicial" name="senha" value={formData.senha} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="tipo-label">Tipo de Usuário</InputLabel>
                  <Select name="tipo" value={formData.tipo} onChange={handleChange} /* ... */ >
                    <MenuItem value="operador">Operador</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Criar Usuário'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Snackbar ... */}
    </>
  );
}

export default GerenciarUsuarios;