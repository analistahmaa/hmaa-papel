import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, LinearProgress, List, ListItem, ListItemText } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import axios from 'axios';

function TotalPorSetorCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/relatorios/total-por-setor');
        setData(response.data);
      } catch (err) {
        setError("Falha ao carregar.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card elevation={4} sx={{ height: '100%', borderRadius: '12px' }}>
      <CardHeader
        avatar={
          <Box sx={{ bgcolor: '#f57c00', borderRadius: '50%', p: 1, display: 'flex' }}>
            <Assessment sx={{ color: '#fff' }} />
          </Box>
        }
        title="Total por Setor (Este Mês)"
        titleTypographyProps={{ fontWeight: 'bold' }}
      />
      <CardContent>
        {loading && <LinearProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && data.length === 0 && (
          <Typography color="text.secondary">Nenhum lançamento no mês.</Typography>
        )}
        {!loading && !error && data.length > 0 && (
          <List dense>
            {data.slice(0, 5).map((item, index) => ( // Mostra o Top 5
              <ListItem key={index} disableGutters>
                <ListItemText
                  primary={item.nome}
                  secondary={`${item.total_resmas} resmas`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default TotalPorSetorCard;