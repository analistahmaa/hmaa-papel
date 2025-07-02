import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

function GerenciarUsuarios() {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    usuario: '',
    senha: '',
    tipo: 'operador', // Valor padrão para o tipo de usuário
  });

  // Estado para controlar o carregamento durante o envio do formulário
  const [loading, setLoading] = useState(false);

  // Estado para as notificações (snackbar)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Função genérica para lidar com a mudança nos campos do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usa a rota de registro que já existe no backend
      await axios.post('/api/auth/register', formData);
      setSnackbar({ open: true, message: 'Usuário criado com sucesso!', severity: 'success' });

      // Limpa o formulário após o sucesso
      setFormData({
        nome: '',
        usuario: '',
        senha: '',
        tipo: 'operador',
      });
    } catch (error) {
      // Mostra uma mensagem de erro vinda da API ou uma mensagem padrão
      const errorMessage = error.response?.data?.message || 'Erro ao criar o usuário.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar a notificação
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Card elevation={3} sx={{ maxWidth: '600px', margin: 'auto', mt: 4 }}>
        <CardHeader
          title="Criar Novo Usuário"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* --- Campo Nome Completo --- */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="nome"
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </Grid>

              {/* --- Campo Nome de Usuário (Login) --- */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="usuario"
                  label="Nome de Usuário (para login)"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  helperText="Ex: joao.silva (sem espaços ou caracteres especiais)"
                />
              </Grid>

              {/* --- Campo Senha Inicial --- */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="senha"
                  label="Senha Inicial"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  helperText="O usuário deverá ser orientado a trocar esta senha no primeiro acesso."
                />
              </Grid>

              {/* --- Campo Tipo de Usuário --- */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="tipo-usuario-label">Tipo de Usuário</InputLabel>
                  <Select
                    labelId="tipo-usuario-label"
                    id="tipo"
                    label="Tipo de Usuário"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <MenuItem value="operador">Operador</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* --- Botão de Ação --- */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* --- Componente de Notificação --- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default GerenciarUsuarios;