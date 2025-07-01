// backend/routes/registros.js
const express = require("express");
const { addRegistro } = require("../controllers/registroController.js");

const router = express.Router();

// Rota para criar um novo registro (POST)
router.post("/", addRegistro);

module.exports = router;