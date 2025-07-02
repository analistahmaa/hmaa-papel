// backend/controllers/relatorioController.js
const db = require("../db/connection.js");

// Função corrigida para somar RESMAS, não folhas.
exports.getDashboardData = async (req, res) => {
  try {
    // Query para somar o total de RESMAS no mês e ano atuais
    const query = `
        SELECT SUM(quantidade_resmas) AS totalResmas
        FROM registros 
        WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
    `;

    const [data] = await db.query(query);
    
    // Se não houver registros, SUM retorna null. Tratamos isso retornando 0.
    const total = data[0].totalResmas || 0;
    
    // Retorna o total de resmas do mês
    return res.status(200).json({ totalResmasMes: total });

  } catch (err) {
    console.error("Erro no getDashboardData:", err);
    return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
  }
};

// Funções de placeholder para as outras rotas de relatório
exports.relatorioPorSetor = async (req, res) => {
  res.json({ message: "Relatório por setor em desenvolvimento" });
};

exports.relatorioTotalMes = async (req, res) => {
  res.json({ message: "Relatório total do mês em desenvolvimento" });
};