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
    // Pega os filtros da query string da URL (ex: /registros?setor_id=5&data_inicio=...)
    const { setor_id, responsavel, data_inicio, data_fim } = req.query;

    let query = `
      SELECT r.id, s.nome AS setor_nome, r.responsavel, r.quantidade_resmas, r.data 
      FROM registros r 
      JOIN setores s ON r.setor_id = s.id
      WHERE 1=1
    `;
    
    const params = [];

    if (setor_id) {
      query += " AND r.setor_id = ?";
      params.push(setor_id);
    }
    if (responsavel) {
      query += " AND r.responsavel LIKE ?";
      params.push(`%${responsavel}%`); // Usando LIKE para busca parcial
    }
    if (data_inicio) {
      query += " AND r.data >= ?";
      params.push(data_inicio);
    }
    if (data_fim) {
      query += " AND r.data <= ?";
      params.push(data_fim);
    }

    query += " ORDER BY r.data DESC, r.id DESC"; // Ordena pelos mais recentes

    const [rows] = await pool.execute(query, params);

    return res.status(200).json(rows);

  } catch (err) {
    console.error("Erro ao buscar registros:", err);
    return res.status(500).json({ message: "Erro interno ao buscar lançamentos." });
  }
};