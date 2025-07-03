// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ao carregar a aplicação, tenta buscar o usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post('/api/auth/login', userData);
      const loggedInUser = response.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(loggedInUser));
      localStorage.setItem('token', response.data.token);
      setUser(loggedInUser);
      navigate('/');
      window.location.reload(); // Força o reload para o App.jsx reavaliar o login
    } catch (error) {
      // Propaga o erro para o formulário de login poder exibi-lo
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};