// backend/controllers/setorController.js
const db = require("../db/connection.js");

exports.getSetores = async (req, res) => {
  try {
    const query = "SELECT id, nome FROM setores ORDER BY nome ASC";
    const [data] = await db.query(query); 
    
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro em getSetores:", err);
    return res.status(500).json({ message: "Erro ao buscar a lista de setores." });
  }
};