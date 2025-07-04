// backend/routes/relatorios.js
const express = require("express");
const router = express.Router();

// Importa apenas as funções que existem no controller
const { 
  getDashboardData,
  getTotalPorSetorMes,
  gerarRelatorioPorSetorPDF
} = require("../controllers/relatorioController.js");

// Rota para o card do dashboard de total geral
router.get("/dashboard", getDashboardData);

// Rota para o card do dashboard de total por setor
router.get("/total-por-setor", getTotalPorSetorMes);

// Rota para o botão que GERA o PDF do relatório por setor
router.get("/por-setor/pdf", gerarRelatorioPorSetorPDF);

module.exports = router;