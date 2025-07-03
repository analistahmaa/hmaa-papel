// frontend/src/components/UltimosLancamentosCard.jsx

import React from 'react';
import { Card, CardHeader, CardContent, Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { History } from '@mui/icons-material';

function UltimosLancamentosCard() {
  // Dados de exemplo (placeholders)
  const lancamentosExemplo = [
    { id: 1, setor: 'ENFERMARIA', data: 'Hoje' },
    { id: 2, setor: 'UTI', data: 'Ontem' },
    { id: 3, setor: 'RECEPÇÃO TRIAGEM', data: 'Ontem' },
  ];

  return (
    <Card elevation={4} sx={{ height: '100%', borderRadius: '12px' }}>
      <CardHeader
        avatar={
          <Box sx={{ bgcolor: '#43a047', borderRadius: '50%', p: 1, display: 'flex' }}>
            <History sx={{ color: '#fff' }} />
          </Box>
        }
        title="Últimos Lançamentos"
        titleTypographyProps={{ fontWeight: 'bold' }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          (Funcionalidade em desenvolvimento)
        </Typography>
        <List dense>
          {lancamentosExemplo.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disableGutters>
                <ListItemText primary={item.setor} secondary={item.data} />
              </ListItem>
              {index < lancamentosExemplo.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default UltimosLancamentosCard;