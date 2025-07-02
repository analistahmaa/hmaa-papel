import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe aqui
import App from './App';
import './index.css'; // Se você tiver um CSS global

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* O BrowserRouter FICA AQUI, envolvendo o App */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);