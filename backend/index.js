// backend/index.js (Exemplo de como ficaria)
const express = require("express");
const cors = require("cors");

// Importe suas rotas
const relatorioRoutes = require("./routes/relatorios.js");
const registroRoutes = require("./routes/registros.js"); // <-- Adicione esta linha

const app = express();

app.use(express.json()); // <-- MUITO IMPORTANTE: para o backend entender o corpo das requisições POST
app.use(cors());

// Defina os prefixos das suas rotas
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/registros", registroRoutes); // <-- Adicione esta linha

app.listen(5000, () => {
  console.log("API conectada na porta 5000");
});