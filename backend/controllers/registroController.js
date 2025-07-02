// backend/controllers/registroController.js
const db = require("../db/connection.js");

exports.addRegistro = async (req, res) => {
  try {
    const { setor_id, responsavel, quantidade_resmas, data } = req.body;
    
    if (!setor_id || !responsavel || !quantidade_resmas || !data) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    
    const query = "INSERT INTO registros(`setor_id`, `responsavel`, `quantidade_resmas`, `data`) VALUES (?)";
    const values = [setor_id, responsavel, quantidade_resmas, data];

    await db.query(query, [values]);

    return res.status(201).json({ message: "Registro criado com sucesso." });
  } catch (err) {
    console.error("Erro ao inserir registro:", err);
    // Retorna uma mensagem de erro mais genérica para o frontend
    return res.status(500).json({ message: "Erro interno ao salvar o registro." });
  }
};