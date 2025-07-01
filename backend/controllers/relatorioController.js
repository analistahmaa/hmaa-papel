// backend/controllers/relatorioController.js
const db = require("../db/connection.js");

exports.getDashboardSummary = async (req, res) => { // <-- async
  try {
    const q = `
        SELECT SUM(quantidade_resmas) * 500 AS totalFolhas 
        FROM registros 
        WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
    `;

    const [data] = await db.query(q); // <-- await
    const total = data[0].totalFolhas || 0;
    
    return res.status(200).json({ totalFolhasMes: total });
  } catch (err) {
    console.error("Erro no getDashboardSummary:", err);
    return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
  }
};

// ... suas outras funções de relatório, também convertidas para async/await ...
exports.relatorioPorSetor = async (req, res) => {
  // Sua lógica com async/await aqui...
  res.json({ message: "Relatório por setor em desenvolvimento" });
};

exports.relatorioTotalMes = async (req, res) => {
  // Sua lógica com async/await aqui...
  res.json({ message: "Relatório total do mês em desenvolvimento" });
};