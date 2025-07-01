// backend/controllers/setorController.js
const db = require("../db/connection.js");

exports.getSetores = async (req, res) => { // <-- 1. Adiciona 'async'
  try {
    const q = "SELECT id, nome FROM setores ORDER BY nome ASC";
    const [data] = await db.query(q); // <-- 2. Usa 'await' e desestrutura o resultado
    
    return res.status(200).json(data);
  } catch (err) {
    // 3. Usa um bloco try...catch para tratar erros
    console.error("Erro em getSetores:", err);
    return res.status(500).json({ message: "Erro ao buscar setores." });
  }
};