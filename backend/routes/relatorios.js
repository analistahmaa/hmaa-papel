// backend/routes/relatorios.js
const express = require("express");
const router = express.Router();

const { 
  getDashboardData, // Renomeado para mais clareza
  relatorioPorSetor,
  relatorioTotalMes
} = require("../controllers/relatorioController.js");

// Rota para os dados do dashboard (usada pelo componente Dashboard.jsx)
router.get("/dashboard", getDashboardData);

// Suas outras rotas
router.get("/setor", relatorioPorSetor);
router.get("/mes", relatorioTotalMes);

module.exports = router;