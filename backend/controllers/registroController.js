// backend/controllers/registroController.js
const pool = require("../db/connection.js");

// Função para ADICIONAR um registro
exports.addRegistro = async (req, res) => {
  try {
    const { setor_id, responsavel, quantidade_resmas, data } = req.body;
    if (!setor_id || !responsavel || !quantidade_resmas || !data) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    const query = "INSERT INTO registros (setor_id, responsavel, quantidade_resmas, data) VALUES (?, ?, ?, ?)";
    const values = [setor_id, responsavel, quantidade_resmas, data];
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 1) {
      return res.status(201).json({ message: "Lançamento salvo com sucesso!" });
    } else {
      throw new Error("A inserção no banco de dados falhou.");
    }
  } catch (err) {
    console.error("Erro ao inserir registro:", err);
    return res.status(500).json({ message: "Erro interno ao salvar o lançamento." });
  }
};

// --- FUNÇÃO FALTANDO ---
// Função para LISTAR os registros com filtros
exports.getRegistros = async (req, res) => {
  try {
    let query = `
      SELECT r.id, s.nome AS setor_nome, r.responsavel, r.quantidade_resmas, r.data 
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
    `;
    const { setor, dataInicio, dataFim } = req.query;
    const conditions = [];
    const values = [];

    if (setor) {
      conditions.push("r.setor_id = ?");
      values.push(setor);
    }
    if (dataInicio && dataFim) {
      conditions.push("r.data BETWEEN ? AND ?");
      values.push(dataInicio, dataFim);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY r.data DESC, r.id DESC";

    const [rows] = await pool.execute(query, values);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar registros:", err);
    return res.status(500).json({ message: "Erro interno ao buscar lançamentos." });
  }
};