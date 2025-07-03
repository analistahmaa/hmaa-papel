// backend/index.js

const express = require("express");
const cors = require("cors");

// --- 1. IMPORTAR TODAS AS ROTAS ---
// A rota de autenticação estava faltando.
const authRoutes = require("./routes/auth.js"); 
const relatorioRoutes = require("./routes/relatorios.js");
const registroRoutes = require("./routes/registros.js");
const setorRoutes = require("./routes/setores.js");
const exportRoutes = require("./routes/export.js");

const app = express();

// --- 2. USAR A VARIÁVEL DE AMBIENTE PARA A PORTA ---
// Isso torna sua aplicação flexível e alinhada com o docker-compose.yml
const PORT = process.env.PORT || 8550;

// --- MIDDLEWARES ---
// É uma boa prática registrar os middlewares antes das rotas.
app.use(express.json()); // Para o Express entender requisições com corpo em JSON
app.use(cors());         // Para permitir requisições de outros domínios (seu frontend)

// Este middleware de charset não é estritamente necessário se a conexão com o DB
// e as tabelas já estão em UTF-8, mas não faz mal mantê-lo.
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// --- 3. REGISTRO DAS ROTAS COM O PREFIXO '/api' ---
// O frontend e o Nginx esperam que todas as rotas da API comecem com '/api'.
app.use("/api/auth", authRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/registros", registroRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/export", exportRoutes);

// Rota de "saúde" da API para testes rápidos
app.get("/api", (req, res) => {
  res.status(200).json({ 
    message: "API do Controle de Papel HMAA está funcionando!",
    status: "online"
  });
});


// --- INICIANDO O SERVIDOR ---
app.listen(PORT, () => {
  // Mensagem de log mais clara
  console.log(`✅ API rodando com sucesso e escutando na porta ${PORT}`);
});