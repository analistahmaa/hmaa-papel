const db = require("../db");

exports.relatorioPorSetor = async (req, res) => {
  const query = `
    SELECT s.nome AS setor, SUM(r.quantidade) AS total
    FROM registros r
    JOIN setores s ON r.setor_id = s.id
    GROUP BY s.id
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.relatorioTotalMes = async (req, res) => {
  const query = `
    SELECT SUM(quantidade) AS total
    FROM registros
    WHERE MONTH(data) = MONTH(CURRENT_DATE())
      AND YEAR(data) = YEAR(CURRENT_DATE())
  `;
  try {
    const [results] = await db.query(query);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};