// backend/routes/export.js
const express = require("express");
const router = express.Router();
const { exportToExcel, exportToPdf } = require("../controllers/exportController.js");

// Rota para exportar para Excel
// Ex: /api/export/excel?setor_id=5
router.get("/excel", exportToExcel);

// Rota para exportar para PDF
router.get("/pdf", exportToPdf);

module.exports = router;