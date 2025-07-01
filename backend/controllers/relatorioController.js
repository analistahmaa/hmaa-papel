// backend/controllers/relatorioController.js
const db = require("../db/connection.js");

// Função para o Dashboard
const getDashboardSummary = (req, res) => {
    const q = `
        SELECT SUM(quantidade_resmas) * 500 AS totalFolhas 
        FROM registros 
        WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
        const total = data[0].totalFolhas || 0;
        return res.status(200).json({ totalFolhasMes: total });
    });
};

// Adicione aqui as outras funções de relatório que você tinha, se houver
const relatorioPorSetor = (req, res) => {
  // Sua lógica aqui...
  res.json({ message: "Relatório por setor em desenvolvimento" });
};

const relatorioTotalMes = (req, res) => {
  // Sua lógica aqui...
  res.json({ message: "Relatório total do mês em desenvolvimento" });
};


// A linha mais importante: exporta TODAS as funções
module.exports = {
  getDashboardSummary,
  relatorioPorSetor,
  relatorioTotalMes
};