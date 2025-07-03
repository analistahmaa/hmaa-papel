// frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // <-- Usar o hook

function Login() {
  const [formData, setFormData] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // <-- Pegar a função de login do contexto

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData); // <-- Chamar a função de login do contexto
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };
  
  // O JSX continua igual
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card elevation={4} sx={{ width: '100%', maxWidth: '400px' }}>
        <CardHeader title="Controle de Papel HMAA" subheader="Acesse o sistema" sx={{ textAlign: 'center' }} />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField margin="normal" required fullWidth id="usuario" label="Nome de Usuário" name="usuario" value={formData.usuario} onChange={handleChange} autoFocus/>
            <TextField margin="normal" required fullWidth name="senha" label="Senha" type="password" id="password" value={formData.senha} onChange={handleChange}/>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;