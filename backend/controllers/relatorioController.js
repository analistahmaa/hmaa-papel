// backend/controllers/relatorioController.js

// Assumindo que seu arquivo de conexão se chama connection.js e está na pasta db
const db = require("../db/connection.js");

// SUA FUNÇÃO EXISTENTE
const relatorioPorSetor = (req, res) => {
  // Sua lógica aqui...
  res.send("Respondendo do relatorioPorSetor");
};

// SUA FUNÇÃO EXISTENTE
const relatorioTotalMes = (req, res) => {
  // Sua lógica aqui...
  res.send("Respondendo do relatorioTotalMes");
};

// ==========================================================
// NOVA FUNÇÃO PARA O DASHBOARD
// ==========================================================
const getDashboardSummary = (req, res) => {
  // Query para somar a quantidade de folhas do mês e ano atuais
  const q = `
    SELECT SUM(quantidade) AS totalFolhas 
    FROM registros 
    WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro no banco de dados:", err);
      return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
    }
    // Se não houver registros, o resultado pode ser null. Tratamos isso.
    const total = data[0].totalFolhas || 0;
    return res.status(200).json({ totalFolhasMes: total });
  });
};

// Exporte todas as funções
module.exports = {
  relatorioPorSetor,
  relatorioTotalMes,
  getDashboardSummary, // Adicione a nova função aqui
};