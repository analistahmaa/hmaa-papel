import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função para atualizar o estado conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Faz a requisição POST para a API de login que criamos
      const response = await axios.post('/api/auth/login', formData);
      
      // --- LÓGICA PÓS-LOGIN (MUITO IMPORTANTE) ---
      // 1. Salva o token e os dados do usuário no localStorage do navegador.
      // Isso permite que a aplicação "lembre" que o usuário está logado.
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      // 2. Redireciona o usuário para a página principal (Dashboard)
      navigate('/');
      
      // 3. (Opcional) Recarrega a página para que componentes como o Layout/Header
      // possam ler os novos dados do localStorage e se atualizar.
      window.location.reload();

    } catch (err) {
      // Exibe a mensagem de erro vinda do backend (ex: "Usuário ou senha inválidos.")
      setError(err.response?.data?.message || 'Erro ao tentar fazer login. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card elevation={4} sx={{ width: '100%', maxWidth: '400px' }}>
        <CardHeader title="Controle de Papel HMAA" subheader="Acesse o sistema" sx={{ textAlign: 'center' }} />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Nome de Usuário"
              name="usuario"
              autoComplete="username"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.senha}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;