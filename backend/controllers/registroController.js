// backend/controllers/registroController.js
const db = require("../db/connection.js");

exports.addRegistro = (req, res) => {
  // 1. Pega os novos dados do corpo da requisição
  const { setor_id, responsavel, quantidade_resmas, data } = req.body;

  // 2. Validação dos campos
  if (!setor_id || !responsavel || !quantidade_resmas || !data) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  // 3. Query SQL com os campos corretos
  const q = "INSERT INTO registros(`setor_id`, `responsavel`, `quantidade_resmas`, `data`) VALUES (?)";
  const values = [setor_id, responsavel, quantidade_resmas, data];

  // 4. Executa a query
  db.query(q, [values], (err) => {
    if (err) {
      console.error("Erro ao inserir registro:", err);
      return res.status(500).json(err);
    }
    return res.status(201).json({ message: "Registro criado com sucesso." });
  });
};