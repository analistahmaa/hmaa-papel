const db = require("../db/connection");

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha]);
    if (rows.length === 0) return res.status(401).json({ error: "Credenciais inválidas" });
    res.json({ token: Buffer.from(email).toString("base64"), usuario: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};