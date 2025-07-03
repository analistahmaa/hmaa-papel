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

exports.getTotalPorSetorMes = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query que agrupa os registros por setor e soma as resmas
    const query = `
      SELECT s.nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE())
        AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome
      ORDER BY total_resmas DESC;
    `;

    const [rows] = await connection.query(query);
    connection.release();

    return res.status(200).json(rows);

  } catch (err) {
    console.error("Erro ao buscar total por setor:", err);
    return res.status(500).json({ message: "Erro interno ao buscar dados por setor." });
  }
};

exports.getUltimosLancamentos = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        s.nome AS setor_nome,
        DATE_FORMAT(r.data, '%d/%m/%Y') AS data_formatada
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      ORDER BY r.data DESC, r.id DESC
      LIMIT 5;
    `;
    const [rows] = await pool.query(query);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar últimos lançamentos:", err);
    return res.status(500).json({ message: "Erro interno ao buscar últimos lançamentos." });
  }
};