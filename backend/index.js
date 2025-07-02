// backend/index.js

const express = require("express");
const cors = require("cors");

const relatorioRoutes = require("./routes/relatorios.js");
const registroRoutes = require("./routes/registros.js");
const setorRoutes = require("./routes/setores.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    // Definimos o cabeçalho para todas as rotas que virão a seguir
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next(); // Passa para a próxima rota/middleware
});

// ==========================================================
//           REGISTRO DE ROTAS SEM O PREFIXO /api
// ==========================================================
app.use("/relatorios", relatorioRoutes); // <-- MUDANÇA AQUI
app.use("/registros", registroRoutes);   // <-- MUDANÇA AQUI
app.use("/setores", setorRoutes);       // <-- MUDANÇA AQUI

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API conectada e rodando na porta ${PORT}`);
});