const db = require("../db/connection");
const bcrypt = require("bcrypt");

// Função para registrar um novo usuário com senha criptografada
exports.register = async (req, res) => {
  const { nome, email, senha, tipo = 'operador' } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
  }

  try {
    // Verifica se o usuário já existe
    const [userExists] = await db.query("SELECT email FROM usuarios WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(409).json({ message: "Este e-mail já está em uso." });
    }

    // Gera o hash da senha
    // O '10' é o "custo" do hash, um bom valor padrão.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Salva o novo usuário no banco de dados
    const query = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
    await db.query(query, [nome, email, hashedPassword, tipo]);

    res.status(201).json({ message: "Usuário registrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ message: "Erro interno ao registrar usuário." });
  }
};


// Função de login com comparação de senha segura
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    // 1. Busca o usuário APENAS pelo e-mail
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    // 2. Se não encontrou o usuário, as credenciais são inválidas
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const usuario = rows[0];

    // 3. Compara a senha enviada com o hash salvo no banco
    const match = await bcrypt.compare(senha, usuario.senha);

    // 4. Se as senhas não batem, as credenciais são inválidas
    if (!match) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // 5. Se tudo deu certo, gera um token (exemplo simples) e retorna os dados do usuário
    // Em um projeto real, use JWT (jsonwebtoken) aqui para um token mais seguro
    const token = Buffer.from(email).toString("base64");
    
    // Remove a senha do objeto antes de enviar de volta para o frontend
    delete usuario.senha; 

    res.json({ token, usuario });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};