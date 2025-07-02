// backend/controllers/relatorioController.js
const pool = require("../db/connection.js");

// Função para buscar os dados para os cards do Dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query para somar o total de resmas no mês e ano atuais
    const query = `
      SELECT SUM(quantidade_resmas) AS totalResmas
      FROM registros
      WHERE MONTH(data) = MONTH(CURRENT_DATE())
        AND YEAR(data) = YEAR(CURRENT_DATE());
    `;

    const [rows] = await connection.query(query);
    connection.release();

    // Se não houver lançamentos, SUM retorna null. Tratamos isso retornando 0.
    const total = rows[0].totalResmas || 0;
    
    // Responde com um objeto JSON contendo os dados
    return res.status(200).json({
      totalResmasMes: total,
    });

  } catch (err) {
    console.error("Erro ao buscar dados para o dashboard:", err);
    return res.status(500).json({ message: "Erro interno ao processar dados do dashboard." });
  }
};

// --- Funções de Placeholder para futuros relatórios ---

exports.relatorioPorSetor = async (req, res) => {
  // TODO: Implementar a lógica para buscar dados por setor
  res.status(501).json({ message: "Relatório por setor ainda não implementado." });
};

exports.relatorioTotalMes = async (req, res) => {
  // TODO: Implementar a lógica para buscar o total por mês
  res.status(501).json({ message: "Relatório total do mês ainda não implementado." });
};