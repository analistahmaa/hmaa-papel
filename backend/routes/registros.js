// backend/routes/registros.js
const express = require("express");
const { addRegistro, getRegistros } = require("../controllers/registroController.js");

const router = express.Router();

// Rota para criar um novo registro (POST)
router.post("/", addRegistro);

// --- NOVA ROTA PARA LISTAR REGISTROS (GET) ---
router.get("/", getRegistros);

module.exports = router;