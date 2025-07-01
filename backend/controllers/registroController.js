// backend/controllers/registroController.js
const db = require("../db/connection.js");

exports.addRegistro = (req, res) => {
  // 1. Pega os dados do corpo da requisição
  const { setor, quantidade, data } = req.body;

  // 2. Validação simples
  if (!setor || !quantidade || !data) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  // 3. Query SQL para inserir os dados
  const q = "INSERT INTO registros(`setor`, `quantidade`, `data`) VALUES (?)";
  const values = [setor, quantidade, data];

  // 4. Executa a query
  db.query(q, [values], (err) => {
    if (err) {
      console.error("Erro ao inserir registro:", err);
      return res.status(500).json(err);
    }
    return res.status(201).json("Registro criado com sucesso.");
  });
};