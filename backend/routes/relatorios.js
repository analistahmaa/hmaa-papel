const express = require("express");
const router = express.Router();
const controller = require("../controllers/relatorioController");

router.get("/setor", controller.relatorioPorSetor);
router.get("/mes", controller.relatorioTotalMes);

module.exports = router;