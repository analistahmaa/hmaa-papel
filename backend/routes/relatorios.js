// backend/routes/relatorios.js

const express = require("express");
const router = express.Router();

// Importe todas as funções do controller
const controller = require("../controllers/relatorioController");

// Rotas existentes
router.get("/setor", controller.relatorioPorSetor);
router.get("/mes", controller.relatorioTotalMes);

// ==========================================================
// NOVA ROTA PARA O DASHBOARD
// ==========================================================
router.get("/summary", controller.getDashboardSummary);

module.exports = router;