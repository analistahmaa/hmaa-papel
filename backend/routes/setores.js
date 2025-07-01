// backend/routes/setores.js
const express = require("express");
const { getSetores } = require("../controllers/setorController.js");

const router = express.Router();

router.get("/", getSetores);

module.exports = router;