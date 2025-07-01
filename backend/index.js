// backend/index.js (Exemplo de como ficaria)
const express = require("express");
const cors = require("cors");

// Importe suas rotas
const setorRoutes = require("./routes/setores.js");
const relatorioRoutes = require("./routes/relatorios.js");
const registroRoutes = require("./routes/registros.js"); 
const app = express();

app.use(express.json()); // <-- MUITO IMPORTANTE: para o backend entender o corpo das requisições POST
app.use(cors());

// Defina os prefixos das suas rotas
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/registros", registroRoutes); 
app.use("/api/setores", setorRoutes);

app.listen(5000, () => {
  console.log("API conectada na porta 5000");
});