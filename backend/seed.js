const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const usuariosParaCriar = [
  // Agora com 'usuario' em vez de 'email'
  { nome: 'Administrador HMAA', usuario: 'admin', senha: 'HM@@#25', tipo: 'admin' }
];

const dbConfig = {
  host: '172.16.5.239',
  port: 3307,
  user: 'root',
  password: 'HMaa.25',
  database: 'hmaa_controle_papel'
};

async function popularUsuarios() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const saltRounds = 10;

    for (const user of usuariosParaCriar) {
      console.log(`Processando usuário: ${user.usuario}`);
      const [existingUser] = await connection.execute('SELECT usuario FROM usuarios WHERE usuario = ?', [user.usuario]);

      if (existingUser.length > 0) {
        console.log(`🟡 Usuário ${user.usuario} já existe. Pulando.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
      const query = 'INSERT INTO usuarios (nome, usuario, senha, tipo) VALUES (?, ?, ?, ?)';
      await connection.execute(query, [user.nome, user.usuario, hashedPassword, user.tipo]);
      console.log(`✅ Usuário ${user.usuario} criado com sucesso!`);
    }
  } catch (error) {
    console.error('❌ ERRO DURANTE O PROCESSO:', error);
  } finally {
    if (connection) await connection.end();
  }
}

popularUsuarios();