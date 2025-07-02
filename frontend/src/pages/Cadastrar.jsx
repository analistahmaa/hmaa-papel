import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

// Componente principal da página de cadastro
function Cadastrar() {
  // Estado para a lista de setores vinda da API
  const [setores, setSetores] = useState([]);
  
  // Estado para controlar o carregamento inicial dos setores
  const [loadingSetores, setLoadingSetores] = useState(true);
  
  // Estado único para os dados do formulário
  const [formData, setFormData] = useState({
    setor_id: '',
    responsavel: '',
    quantidade_resmas: '',
    data: new Date().toISOString().split('T')[0], // Padrão para data de hoje
  });

  // Estado para controlar o envio do formulário
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // Estado para as notificações (snackbar)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Função para buscar os setores da API.
  // Usamos useCallback para evitar recriações desnecessárias da função.
  const fetchSetores = useCallback(async () => {
    setLoadingSetores(true);
    try {
      const response = await axios.get('/api/setores');
      setSetores(response.data);
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      // Informa o usuário sobre o erro ao carregar os setores
      setSnackbar({
        open: true,
        message: 'Falha ao carregar a lista de setores. Tente recarregar a página.',
        severity: 'error',
      });
    } finally {
      setLoadingSetores(false);
    }
  }, []); // O array vazio significa que esta função nunca muda

  // useEffect para chamar a busca de setores apenas uma vez, quando o componente montar.
  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  // Função genérica para lidar com a mudança em qualquer campo do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário
    setLoadingSubmit(true);

    try {
      // Envia os dados do formulário para a API
      await axios.post('/api/registros', formData);
      setSnackbar({ open: true, message: 'Lançamento salvo com sucesso!', severity: 'success' });
      // Limpa os campos do formulário após o sucesso, mantendo a data
      setFormData({
        setor_id: '',
        responsavel: '',
        quantidade_resmas: '',
        data: formData.data, // Mantém a data que o usuário escolheu
      });
    } catch (error) {
      // Pega a mensagem de erro da resposta da API, ou uma mensagem padrão
      const errorMessage = error.response?.data?.message || 'Erro ao salvar o lançamento.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Função para fechar a notificação (snackbar)
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* O Card serve como um container elegante para o formulário */}
      <Card elevation={3} sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
        <CardHeader
          title="Cadastrar Novo Lançamento"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
        />
        <CardContent>
          {/* O 'component="form"' transforma o Box em um formulário HTML */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* --- CAMPO SETOR --- */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="setor_id"
                  name="setor_id"
                  value={formData.setor_id}
                  onChange={handleChange}
                  select
                  required
                  fullWidth
                  label="Setor"
                  disabled={loadingSetores}
                  helperText={loadingSetores ? 'Carregando lista...' : 'Selecione o setor'}
                >
                  {/* O MUI trata o placeholder de forma elegante */}
                  {setores.map((setor) => (
                    <MenuItem key={setor.id} value={setor.id}>
                      {setor.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* --- CAMPO RESPONSÁVEL --- */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="responsavel"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  required
                  fullWidth
                  label="Nome do Responsável"
                  helperText="Quem está registrando o consumo"
                />
              </Grid>

              {/* --- CAMPO QUANTIDADE --- */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="quantidade_resmas"
                  name="quantidade_resmas"
                  value={formData.quantidade_resmas}
                  onChange={handleChange}
                  required
                  fullWidth
                  label="Quantidade de Resmas"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }} // Garante que o número não seja negativo
                  helperText="Apenas números inteiros"
                />
              </Grid>

              {/* --- CAMPO DATA --- */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  fullWidth
                  label="Data do Lançamento"
                  type="date"
                  InputLabelProps={{ shrink: true }} // Garante que a label não sobreponha a data
                  helperText="Data do registro do consumo"
                />
              </Grid>
            </Grid>

            {/* --- BOTÃO DE ENVIO --- */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loadingSubmit || loadingSetores}
                // Mostra o spinner de carregamento DENTRO do botão
                startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loadingSubmit ? 'Salvando...' : 'Salvar Lançamento'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Componente de notificação para feedback ao usuário */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Cadastrar;