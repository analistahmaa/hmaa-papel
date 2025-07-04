// backend/controllers/registroController.js
const pool = require("../db/connection.js"); // Usando o pool de conexões com promessas

// Renomeado para seguir o padrão async/await
exports.addRegistro = async (req, res) => {
  try {
    const { setor_id, responsavel, quantidade_resmas, data } = req.body;
    
    // Validação de entrada
    if (!setor_id || !responsavel || !quantidade_resmas || !data) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    
    // Query SQL para inserir um novo registro
    const query = "INSERT INTO registros (setor_id, responsavel, quantidade_resmas, data) VALUES (?, ?, ?, ?)";
    
    // Array de valores que correspondem aos '?' na query
    const values = [setor_id, responsavel, quantidade_resmas, data];

    // Executando a query com o pool de conexões
    // O await garante que o código vai esperar a query terminar
    const [result] = await pool.execute(query, values);

    // Verificação se a inserção foi bem-sucedida
    if (result.affectedRows === 1) {
      return res.status(201).json({ message: "Lançamento salvo com sucesso!" });
    } else {
      // Caso raro, mas é bom ter
      throw new Error("A inserção no banco de dados falhou, nenhuma linha foi afetada.");
    }

  } catch (err) {
    // Captura qualquer erro que aconteça no bloco 'try'
    console.error("Erro ao inserir registro:", err);
    return res.status(500).json({ message: "Erro interno no servidor ao tentar salvar o lançamento." });
  }
};