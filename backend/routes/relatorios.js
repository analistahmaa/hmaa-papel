// backend/routes/relatorios.js
const express = require("express");
const router = express.Router();

// Importando as funções do controller
const { 
  getDashboardData,
  relatorioPorSetor,
  relatorioTotalMes
} = require("../controllers/relatorioController.js");

// Rota para os dados do dashboard (usada pelo componente Dashboard.jsx)
// Acessível via: GET /api/relatorios/dashboard
router.get("/dashboard", getDashboardData); 

// Outras rotas de relatório para o futuro
router.get("/por-setor", relatorioPorSetor);
router.get("/total-mes", relatorioTotalMes);

module.exports = router;