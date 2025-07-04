// backend/routes/registros.js
const express = require("express");

// Agora, ambas as funções serão importadas corretamente
const { addRegistro, getRegistros } = require("../controllers/registroController.js");

const router = express.Router();

// Rota para LISTAR todos os registros (GET /api/registros)
router.get("/", getRegistros);

// Rota para CRIAR um novo registro (POST /api/registros)
router.post("/", addRegistro);

module.exports = router;