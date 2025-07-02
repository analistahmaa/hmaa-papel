const db = require("../db/connection");
const bcrypt = require("bcrypt");

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  // Agora recebemos 'usuario' em vez de 'email'
  const { nome, usuario, senha, tipo = 'operador' } = req.body;

  if (!nome || !usuario || !senha) {
    return res.status(400).json({ message: "Nome, usuário e senha são obrigatórios." });
  }

  try {
    // Verifica se o nome de usuário já existe
    const [userExists] = await db.query("SELECT usuario FROM usuarios WHERE usuario = ?", [usuario]);
    if (userExists.length > 0) {
      return res.status(409).json({ message: "Este nome de usuário já está em uso." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const query = "INSERT INTO usuarios (nome, usuario, senha, tipo) VALUES (?, ?, ?, ?)";
    await db.query(query, [nome, usuario, hashedPassword, tipo]);

    res.status(201).json({ message: "Usuário registrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ message: "Erro interno ao registrar usuário." });
  }
};


// Função de login (MODIFICADA)
exports.login = async (req, res) => {
  const { usuario, senha } = req.body; // <-- Mudou de 'email' para 'usuario'

  if (!usuario || !senha) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  try {
    // 1. Busca o usuário pelo NOME DE USUÁRIO
    const [rows] = await db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    // Token simples (para produção, use JWT)
    const token = Buffer.from(user.usuario).toString("base64");
    
    delete user.senha; 
    res.json({ token, usuario: user });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};