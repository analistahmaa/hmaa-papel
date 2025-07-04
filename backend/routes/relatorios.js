// backend/routes/relatorios.js
const express = require("express");
const router = express.Router();

// Importando as funções do controller
const { 
  getDashboardData,
  gerarRelatorioPorSetor,
  relatorioTotalMes,
  getTotalPorSetorMes,
  getUltimosLancamentos
} = require("../controllers/relatorioController.js");


// Rota para os dados do dashboard (usada pelo componente Dashboard.jsx)
// Acessível via: GET /api/relatorios/dashboard
router.get("/dashboard", getDashboardData); 

// Outras rotas de relatório para o futuro
router.get("/por-setor", gerarRelatorioPorSetor);
router.get("/total-mes", relatorioTotalMes);
router.get("/total-por-setor", getTotalPorSetorMes);
router.get("/ultimos-lancamentos", getUltimosLancamentos);

module.exports = router;