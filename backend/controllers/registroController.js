// backend/controllers/registroController.js
const pool = require("../db/connection.js");

// Função para adicionar um registro (já existe)
exports.addRegistro = async (req, res) => {
    // ... seu código existente ...
};

// --- NOVA FUNÇÃO PARA LISTAR REGISTROS ---
exports.getRegistros = async (req, res) => {
  try {
    // Pega os parâmetros de filtro da query string (ex: /registros?setor_id=5)
    const { setor_id, responsavel, data_inicio, data_fim } = req.query;

    let query = `
      SELECT 
        r.id,
        s.nome AS setor_nome,
        r.responsavel,
        r.quantidade_resmas,
        DATE_FORMAT(r.data, '%d/%m/%Y') AS data_formatada
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
    `;

    const params = [];
    const conditions = [];

    if (setor_id) {
      conditions.push("r.setor_id = ?");
      params.push(setor_id);
    }
    if (responsavel) {
      conditions.push("r.responsavel LIKE ?");
      params.push(`%${responsavel}%`); // Usamos LIKE para buscas parciais
    }
    if (data_inicio && data_fim) {
      conditions.push("r.data BETWEEN ? AND ?");
      params.push(data_inicio, data_fim);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " ORDER BY r.data DESC, r.id DESC";

    const [rows] = await pool.query(query, params);
    
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar registros:", err);
    return res.status(500).json({ message: "Erro interno ao buscar registros." });
  }
};