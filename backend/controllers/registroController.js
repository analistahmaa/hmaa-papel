const db = require("../db");

exports.listarRegistros = async (req, res) => {
  let query = "SELECT r.*, s.nome AS setor_nome FROM registros r JOIN setores s ON r.setor_id = s.id WHERE 1=1";
  const params = [];

  const { setor_id, responsavel, data_inicio, data_fim } = req.query;

  if (setor_id) {
    query += " AND r.setor_id = ?";
    params.push(setor_id);
  }

  if (responsavel) {
    query += " AND r.responsavel LIKE ?";
    params.push(`%${responsavel}%`);
  }

  if (data_inicio) {
    query += " AND r.data >= ?";
    params.push(data_inicio);
  }

  if (data_fim) {
    query += " AND r.data <= ?";
    params.push(data_fim);
  }

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criarRegistro = async (req, res) => {
  const { setor_id, quantidade, responsavel, data } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO registros (setor_id, quantidade, responsavel, data) VALUES (?, ?, ?, ?)",
      [setor_id, quantidade, responsavel, data]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};