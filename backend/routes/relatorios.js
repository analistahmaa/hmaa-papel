// backend/routes/relatorios.js
const express = require("express");
const router = express.Router();

// Importa TODAS as funções do controller
const { 
  getDashboardSummary,
  relatorioPorSetor,
  relatorioTotalMes
} = require("../controllers/relatorioController.js");

// Rota para o summary do dashboard
router.get("/summary", getDashboardSummary);

// Suas rotas antigas, agora usando as funções importadas corretamente
router.get("/setor", relatorioPorSetor);
router.get("/mes", relatorioTotalMes);

module.exports = router;